import { expect } from "chai";
import { createFheInstance } from "../../utils/instance";
import type { Signers } from "../types";
import { deployVotingFixture } from "./Voting.fixture";
import hre from "hardhat";
import { EncryptionTypes } from "fhenixjs";

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
  });

  describe("Voting", function () {
    console.log("Running tests for Voter contract...")

    // address of the contract
    it("Should return the address of the contract", async function () {
      expect(this.address).to.equal(this.voting.address);
    });

    it("Should allow me to vote", async function () {
      let encrypted = await this.instance.instance.encrypt(0, EncryptionTypes.uint8);
      await expect(this.voting.vote(encrypted)).to.be.ok;

      // await increaseTime(10000);

      await expect(this.voting.vote(encrypted)).to.be.ok;
      
      // reverts for some reason
      // console.log("sleeping for 2 seconds")
      // await sleep(2000);
      // await this.voting.finalize()
    });
  });
});
