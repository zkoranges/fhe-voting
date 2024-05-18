import type { Voting } from "../../types";
import axios from "axios";
import hre from "hardhat";

export async function deployVotingFixture(): Promise<{
  voting: Voting;
  address: string;
}> {
  const accounts = await hre.ethers.getSigners();
  const contractOwner = accounts[0];

  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.connect(contractOwner).deploy("Proposal", ["Option 1", "Option 2", "Option 3", "Option 4"], 0, ["0xd7702EB6Ca4C101C918f7d4eaBeDc36e36260482", "0x3F9CD0795CCf3bEEd6fB510A2b0db6950696ea30", "0x4605eC2552cB2433A9b4B83881dd2473C709b4e8"]);

  await voting.waitForDeployment();
  const address = await voting.getAddress();
  return { voting, address };
}

export async function getTokensFromFaucet() {
  if (hre.network.name === "localfhenix") {
    const signers = await hre.ethers.getSigners();

    if (
      (await hre.ethers.provider.getBalance(signers[0].address)).toString() ===
      "0"
    ) {
      await hre.fhenixjs.getFunds(signers[0].address);
    }
  }
}
