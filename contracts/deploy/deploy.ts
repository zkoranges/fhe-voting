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
  // const voting = await Voting.connect(contractOwner).deploy();

  const voting = await deploy("Voting", {
    from: signer.address,
    args: ["Proposal", ["Option 1", "Option 2"], 100000],
    log: true,
    skipIfAlreadyDeployed: false,
  });

  console.log(`Voting contract: `, voting.address);
};

export default func;
func.id = "deploy_voting";
func.tags = ["Voting"];
