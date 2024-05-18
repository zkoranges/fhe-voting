# Fhenix Voting App

## Overview
Run voting campaigns that **protect voter choices** using FHE (Fully Homomorphic Encryption) **without the need of a trusted coordinator**.

This repository contains a full-stack blockchain voting application that leverages Fhenix Fully Homomorphic Encryption (FHE) to ensure the confidentiality of votes. 


While the election creator can determine who is eligible to vote, they cannot view individual votes. The results are revealed only after the election concludes.

## Features
- Confidential Voting: Votes are encrypted using Fhenix FHE, ensuring that they remain confidential. The encrypted votes are posted to a smart contract in Fhenix L2 Rollup. 
- No Trusted Coordinator: The system does not rely on a trusted third party to coordinate the election or manage votes.
- Controlled Eligibility: The election creator can specify who is allowed to vote.
- Result Disclosure: Results are only available once the election has ended. No one can decrypt individual votes.

To check it out, simply check the deployed app on Fhenix Tesnet : xxx


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
- Prefer time-limited audits. Current implementation doesn't account for time.
- Enhance the user interface for better user experience.

## Contributing
Contributions are welcome! 

Please open an issue or submit a pull request if you have suggestions or improvements.

## License
This project is licensed under the MIT License.

Please note there are guarantees and that this software may contain bugs.

## Acknowledgements
Special thanks to: 

- The Fhenix team for their work on fully homomorphic encryption.
- ZKHack Kraków team for organizing the hackathon!

## Disclaimer
This application is for experimental purposes only and should not be used in a production environment. 

The current implementation makes several assumptions to work around the limitations presented.