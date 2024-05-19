# FHE Voting App

## Overview
Run voting campaigns that **protect voter choices** using FHE (Fully Homomorphic Encryption) **without the need of a trusted coordinator**.

This repository contains a full-stack blockchain voting application that leverages Fhenix Fully Homomorphic Encryption (FHE) to ensure the confidentiality of votes. 

While the election creator can determine who is eligible to vote, they cannot view individual votes. The results are revealed only after the election concludes.

## Features
- Confidential Voting: Votes are encrypted using Fhenix FHE, ensuring that they remain confidential. The encrypted votes are posted to a smart contract in Fhenix L2 Rollup. 
- No Trusted Coordinator: The system does not rely on a trusted third party to coordinate the election or manage votes.
- Controlled Eligibility: The election creator can specify who is allowed to vote and how long does the vote run for.
- Result Disclosure: Results are only available once the election has ended. No one can decrypt individual votes.
- This particular implementation serves as a demonstration: voting runs for a certain period of time and each participant may only vote once. However, as you can see in Voting.sol, this behavior can be easily modified in function of the application needs.

## Advantages over other approaches that use ZK
- In comparison to MACI (privacy scaling explorations): although MACI's approach reduces the effectiveness of bribery, it requires a trusted coordinator that can decrypt the votes. Our approach doesn't require a trusted coordinator, meaning the votes a truly private.
- FHE Voting doesn't require custom circuits (from the applciation perspective) that would need a complete re-think when adding extra functionality. In that sense, this approach is more adaptable.
- Minimal number of steps: campaign creation, voting and finalization which decrypts the results.

<div align="center">

![FHE](https://raw.githubusercontent.com/zkoranges/fhe-voting/main/frontend/public/fhe-rainbow.jpeg)
</div>

## Running your own voting campaign
This procedure explains how to run a voting campaign on localhost. This can be replicated on any fhenix compatible network. 

Prerequisites:

- Node.js (tested with version 18)
- yarn

### Setup
Clone the repository:

```bash
git clone https://github.com/zkoranges/fhe-voting

cd fhe-voting
```

Install dependencies:

```bash
cd frontend
yarn
cd ../contracts
yarn
```

Note: for the contracts, configure your environment variables in the `.env` file.


- Deploy Voting.sol with your desired voting options and voter set.

```
hardhat deploy
```

``Note: you can add --network testnet for testnet``

- Copy the deployed Voting contract into wagmiConfig.ts `votingAddress` variable.

- Connect Wallet: Use a web3-enabled browser or extension (e.g., MetaMask) to connect your wallet.

- Vote: Eligible voters can cast their encrypted votes via Metamask!

- Finalize Voting: Once voting is completed, anybody can finalize the election (to be improved).

- View Results: The results are decrypted and displayed after finalization.

### Limitations

- Experimental Use Only: This app is intended for experimental purposes and is not production-ready.
- Development Assumptions: Various assumptions were made to bypass limitations of the development toolkit.
- Limited Voting Options: Currently, the app only supports up to 4 voting options.
- Please note this app was developed under time pressure and in hackathon conditions (ZKHack Kraków).

### Future Work
- Use VotingFactory provided to create endless voting campaigns.
- Expand the number of voting options beyond the current limit of 4.
- Improve the robustness and security of the application for production use.
- Enhance the user interface for better user experience.

## Contributing
Contributions are welcome! 

Please open an issue or submit a pull request if you have suggestions or improvements.

## Acknowledgements
Special thanks to: 

- The Fhenix team for their work on fully homomorphic encryption.
- ZKHack Kraków team for organizing the hackathon!

## Disclaimer
This application is for experimental purposes only and should not be used in a production environment. 

The current implementation makes several assumptions to work around the limitations presented.
