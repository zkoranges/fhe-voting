// This snippet aims to integrate the OpenFHE library with Risc0, leveraging Hyle.eu's settlement layer for proof verification.

// A key development in this effort is the submission of a feature proposal to Risc0's GitHub repository: Feature Proposal #1857.

// GUEST CODE
let clear_b = 5u32;
let clear_c = 7u8;

let encrypted_b = FheUint32::try_encrypt(clear_b, &client_key).unwrap();
let encrypted_c = FheUint8::try_encrypt(clear_c, &client_key).unwrap();

set_server_key(server_keys);

let encrypted_res_mul = &encrypted_state * &encrypted_b;
let encrypted_a_shifted = &encrypted_res_mul >> &encrypted_b;
let casted_a: FheUint8 = encrypted_a_shifted.cast_into();
let encrypted_res_min = casted_a.min(&encrypted_c);
let encrypted_res = &encrypted_res_min & 1_u8;

let encrypted_vec = [encrypted_res_mul, encrypted_a_shifted];

for encrypted_val in &encrypted_vec {
    let _clear_val: u32 = encrypted_val.decrypt(&client_key);
}

let final_res: u8 = encrypted_res.decrypt(&client_key);

let encrypted_next_state = FheUint32::try_encrypt(next_state, &client_key)?;
let decrypted_next_state = encrypted_next_state.decrypt(&client_key);  

// HOST CODE

use base64::prelude::*;
use clap::{Parser, Subcommand};
use hyle_contract::{HyleInput, HyleOutput};
use methods::METHOD_ELF;
use risc0_zkvm::{default_prover, sha::Digestible, ExecutorEnv};
use serde_json;

#[derive(Parser)]
#[command(author, version, about, long_about = None)]
#[command(propagate_version = true)]
struct Cli {
    #[command(subcommand)]
    command: Commands,

    #[clap(long, short)]
    reproducible: bool,
}

#[derive(Subcommand)]
enum Commands {
    Next { input: u32 },
    Reset { input: u32 },
}

fn main() {
    let cli = Cli::parse();

    if cli.reproducible {
        println!("Running with reproducible ELF binary.");
    } else {
        println!("Running non-reproducibly");
    }

    let receipt = match &cli.command {
        Commands::Next { input } => prove(cli.reproducible, *input, 0),
        Commands::Reset { input } => prove(cli.reproducible, 1, *input),
    };

    let claim = receipt.inner.get_claim().unwrap();

    let receipt_json = serde_json::to_string(&receipt).unwrap();
    std::fs::write("proof.json", receipt_json).unwrap();

    let hyle_output = receipt.journal.decode::<HyleOutput<String>>().unwrap();

    let initial_state_b64 = BASE64_STANDARD.encode(&hyle_output.initial_state);
    let next_state_b64 = BASE64_STANDARD.encode(&hyle_output.next_state);
    let initial_state_u32: u32 = u32::from_be_bytes(hyle_output.initial_state.try_into().unwrap());
    let next_state_u32: u32 = u32::from_be_bytes(hyle_output.next_state.try_into().unwrap());
    let block_number: u32 = hyle_output.block_number;
    let block_time: u32 = hyle_output.block_time;
    let program_outputs = hyle_output
        .program_outputs
        .unwrap_or_else(|| "default".to_owned());

    println!("{}", "-".repeat(20));
    println!("Method ID: {:?} (hex)", claim.pre.digest());
    println!(
        "proof.json written, transition from {} ({}) to {} ({})",
        initial_state_b64, initial_state_u32, next_state_b64, next_state_u32
    );
    println!("Aiming block {} at time {}.", block_number, block_time);
    println!("Program outputted {:?}", program_outputs);
}

fn prove(reproducible: bool, initial_state: u32, suggested_number: u32) -> risc0_zkvm::Receipt {
    let env = ExecutorEnv::builder()
        .write(&HyleInput {
            block_number: 0,  //TODO
            block_time: 0,    //TODO
            caller: vec![1],  //TODO
            tx_hash: vec![1], //TODO
            initial_state,
            program_inputs: Some(suggested_number),
        })
        .unwrap()
        .build()
        .unwrap();

    let prover = default_prover();
    let binary = if reproducible {
        std::fs::read("target/riscv-guest/riscv32im-risc0-zkvm-elf/docker/method/method")
            .expect("Could not read ELF binary at target/riscv-guest/riscv32im-risc0-zkvm-elf/docker/method/method")
    } else {
        METHOD_ELF.to_vec()
    };
    prover.prove(env, &binary).unwrap()
}