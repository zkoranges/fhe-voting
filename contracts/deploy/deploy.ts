import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import chalk from "chalk";

const hre = require("hardhat");

const func: DeployFunction = async function () {
  const { fhenixjs, ethers } = hre;
  const { deploy } = hre.deployments;
  const [signer] = await ethers.getSigners();

  if ((await ethers.provider.getBalance(signer.address)).toString() === "0") {
    if (hre.network.name === "localfhenix") {
      await fhenixjs.getFunds(signer.address);
    } else {
        console.log(
            chalk.red("Please fund your account with testnet FHE from https://faucet.fhenix.zone"));
        return;
    }
  }

  // Create a really important voting campaign
  let secondsToVote = 120;
  const voting = await deploy("Voting", {
    from: signer.address,
    args: ["Who is the best SpongeBob SquarePants character?", ["Patrick Star", "Sandy Cheeks", "Mr. Krabs"], secondsToVote, ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"]],
    log: true,
    skipIfAlreadyDeployed: false,
  });

  console.log(`Voting contract: `, voting.address);
};

export default func;
func.id = "deploy_voting";
func.tags = ["Voting"];