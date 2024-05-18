import { expect } from "chai";
import { createFheInstance } from "../../utils/instance";
import type { Signers } from "../types";
import { deployVotingFixture } from "./Voting.fixture";
import hre from "hardhat";
import { EncryptionTypes } from "fhenixjs";
import { ethers } from "hardhat";
import { parseEther } from "ethers";

// // Helper function to move time forward - Not supported in fhenix evm
// async function increaseTime(seconds: number) {
//   await hre.network.provider.send("evm_increaseTime", [seconds]);
//   await hre.network.provider.send("evm_mine", []);
// }

function sleep(ms: number) {
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
    this.user1 = signers[1];
    this.user2 = signers[2];
    this.user3 = signers[3];

    console.log("Admin: ", this.signers.admin.address);
    console.log("User1: ", this.user1.address);
    console.log("User2: ", this.user2.address);
    console.log("User3: ", this.user3.address);

    await this.signers.admin.sendTransaction({
      to: this.user1.address,
      value: parseEther("0.1"),
    });

    await this.signers.admin.sendTransaction({
      to: this.user2.address,
      value: parseEther("0.1"),
    });

    await this.signers.admin.sendTransaction({
      to: this.user3.address,
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
      let encrypted1 = await this.instance.instance.encrypt(1, EncryptionTypes.uint8);
      let encrypted3 = await this.instance.instance.encrypt(3, EncryptionTypes.uint8);
      console.log("Encrypted vote 1: ", encrypted1);

      await this.voting.connect(this.signers.admin).vote(encrypted1)
      await this.voting.connect(this.user2).vote(encrypted3)
      await this.voting.connect(this.user1).vote(encrypted3)

      // should not count! user 3 is not registered
      await this.voting.connect(this.user3).vote(encrypted1)

      // check if admin and user1 are able to vote
      const canAdminVote = await this.voting.voters(this.signers.admin.address);
      const canUser1Vote = await this.voting.voters(this.user1.address);
      const canUser2Vote = await this.voting.voters(this.user2.address);
      const canUser3Vote = await this.voting.voters(this.user3.address);

      console.log("Can admin vote: ", canAdminVote.toString());
      console.log("Can user1 vote: ", canUser1Vote.toString());
      console.log("Can user2 vote: ", canUser2Vote.toString());
      console.log("Can user3 vote: ", canUser3Vote.toString());

      console.log("sleeping for 1 second")
      await sleep(1000);
      await this.voting.finalize()

      
      // since we are using time based voting and fhenix evm doesn't support time manipulation as far as we know, we can't test this here.
      // this was tested without the time constraint and it worked as expected
      // it was also tested on testnet with the time constraints and it worked as expected
      
      // REMOVE TIME CONSTRAINTS IN THE CONTRACT AND TEST THIS IF NEEDED
      // const result = await this.voting.winning();
      // const winnerIndex = result[0];
      // const winnerVotes = result[1];

      // expect(winnerIndex).to.equal(3);
      // expect(winnerVotes).to.equal(2);

      // console.log("winnerIndex: ", winnerIndex.toString());
      // console.log("winnerVotes: ", winnerVotes.toString());
    });
  });
});
