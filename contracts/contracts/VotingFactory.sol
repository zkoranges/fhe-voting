// SPDX-License-Identifier: BSD-3-Clause-Clear
// WARNING THIS IS An EXPERIMENTAL CONTRACT AND IS NOT READY FOR PRODUCTION USE

pragma solidity >=0.8.19 <0.9.0;

import "./Voting.sol";

contract VotingFactory {
    event VotingCreated(address votingAddress, string proposal);

    Voting[] public votings;

    function createVoting(
        string memory _proposal,
        string[] memory _options,
        uint votingPeriod,
        address[] memory _voters
    ) public {
        Voting newVoting = new Voting(_proposal, _options, votingPeriod, _voters);
        votings.push(newVoting);
        emit VotingCreated(address(newVoting), _proposal);
    }

    function getVotingCount() public view returns (uint) {
        return votings.length;
    }

    function getVotingAddress(uint index) public view returns (address) {
        require(index < votings.length, "Index out of bounds");
        return address(votings[index]);
    }
}
