import { expect } from "chai";
import { createFheInstance } from "../../utils/instance";
import type { Signers } from "../types";
import { deployVotingFixture } from "./Voting.fixture";
import hre from "hardhat";
import { EncryptionTypes } from "fhenixjs";
import { ethers } from "hardhat";
import { parseEther } from "ethers";

// Helper function to move time forward
async function increaseTime(seconds: number) {
  await hre.network.provider.send("evm_increaseTime", [seconds]);
  await hre.network.provider.send("evm_mine", []);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    // deploy test contract
    const { voting, address } = await deployVotingFixture();
    this.voting = voting;
    this.votingAddress = address;

    // initiate fhenixjs
    this.instance = await createFheInstance(hre, address);

    // set admin account/signer
    const signers = await hre.ethers.getSigners();
    this.signers.admin = signers[0];
    this.user1 = signers[2];

    // print admin and user1
    console.log("Admin: ", this.signers.admin.address);
    console.log("User1: ", this.user1.address);

    const tx = await this.signers.admin.sendTransaction({
      to: this.user1.address,
      value: parseEther("0.1"),
    });
  });

  describe("Voting", function () {
    console.log("Running tests for Voter contract...")

    // address of the contract
    it("Should return the address of the contract", async function () {
      expect(this.address).to.equal(this.voting.address);
    });

    it("Should allow me to vote", async function () {
      let encrypted3 = await this.instance.instance.encrypt(1, EncryptionTypes.uint8);

      await this.voting.connect(this.signers.admin).vote(encrypted3)

      let encrypted1 = await this.instance.instance.encrypt(1, EncryptionTypes.uint8);
      await this.voting.connect(this.user1).vote(encrypted1)

      // check if admin and user1 are able to vote
      const canAdminVote = await this.voting.voters(this.signers.admin.address);
      const canUser1Vote = await this.voting.voters(this.user1.address);

      console.log("Can admin vote: ", canAdminVote.toString());
      console.log("Can user1 vote: ", canUser1Vote.toString());

      console.log("sleeping for 1 second")
      await sleep(1000);
      await this.voting.finalize()

      const result = await this.voting.winning();
      const winnerIndex = result[0];
      const winnerVotes = result[1];

      console.log("winnerIndex: ", winnerIndex.toString());
      console.log("winnerVotes: ", winnerVotes.toString());
    });
  });
});
