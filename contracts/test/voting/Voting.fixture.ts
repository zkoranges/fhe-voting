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
  const voting = await Voting.connect(contractOwner).deploy("Proposal", ["Option 1", "Option 2","Option 3","Option 4"], 0);

  // constructor(string memory _proposal, string[] memory _options, uint votingPeriod) {

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
