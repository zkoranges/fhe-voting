'use client'
import React, { useEffect, useState } from 'react';
import { useBlockNumber, useChainId } from 'wagmi';

import { votingAddress } from '@/config/wagmiConfig';
import votingAbi from '../abi/Voting.json';
import { ethers } from 'ethers';
import { FhenixClient } from 'fhenixjs';
import { useEthersProvider, useEthersSigner } from '../utils/viemEthersConverters'; // Adjust the import path as needed

//// START OF THE COMPONENT //// 
export default function LandingPage() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [proposalName, setProposalName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [fheClient, setFheClient] = useState(null);
  const [finalizedClicked, setFinalizedClicked] = useState(false);
  const [finalized, setFinalized] = useState<boolean>(false);
  const [winningValues, setWinningValues] = useState({ uint8Value: null, uint16Value: null });

  const { data: blockNumberData } = useBlockNumber({ watch: true });
  const chainId = useChainId();

  // Can we get a provider and signer please? 
  const signer = useEthersSigner()
  // console.log('Signer:', signer)
  const provider = useEthersProvider()
  // console.log('Provider:', provider)

  useEffect(() => {
    if (provider) {
      initFHEClient();
    }
  }, [provider]);

  const initFHEClient = () => {
    const client = new FhenixClient({ provider });
    setFheClient(client);
  };

  // console.log('FHE Client:', fheClient)

  const getFheClient = () => {
    return fheClient;
  };

  const encrypt = async (element) => {
    try {
      if (element !== null) {
        const value = Number(element);
        const fheClient = getFheClient();
        if (isNaN(value)) {
          throw new Error("Invalid number value");
        }
        
        if (fheClient !== null) {
          const uint8Array = (await fheClient.encrypt_uint8(value));
          return uint8Array;
          // return `0x${Array.from(uint8Array).map(b => b.toString(16).padStart(2, '0')).join('')}`;
        }
      }
    } catch (err) {
      console.log("Error:", err);
      return null;
    }
  };

  // Create a contract instance
  const votingContract = new ethers.Contract(votingAddress, votingAbi['abi'], provider);  

  // Fetch the proposal name
  useEffect(() => {
    const fetchProposalName = async () => {
      try {
        const name = await votingContract.proposal();
        console.log('Proposal Name:', name);
        setProposalName(name);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchProposalName();
  }, []);

  useEffect(() => {
    const fetchFinalized = async () => {
      try {
        const finalized = await votingContract.finalized();
        console.log('Finalized?:', finalized);
        setFinalized(finalized);

        if (finalized) {
          fetchWinningValues();
        }
      } catch (error) {
        console.error('Error fetching finalized status:', error);
      } 
    };

    fetchFinalized();
  }, [finalizedClicked]);



  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedOption === null) {
      alert('Please select an option before submitting.');
      return;
    }
    console.log('Selected Option:', selectedOption);

    // console.log("Encrypted vote:")
    const encryptedVote = await encrypt(selectedOption);
    // console.log(encryptedVote);

    // subtmit the vote using vote(bytes) function
    console.log("Submitting vote...")
    console.log("Voting contract:", votingContract)
    console.log("Signer:", signer)
    console.log("Encrypted vote:", encryptedVote)
    await votingContract.connect(signer).vote(encryptedVote);

    // Set the submitted state to true
    setIsSubmitted(true);
  };


  const handleFinalizeVoting = async () => {
    // Add the logic to finalize the voting process
    console.log('Finalize Voting button clicked');
    // await votingContract.connect(signer).finalize();

    try {
      const tx = await votingContract.connect(signer).finalize();
      await tx.wait();
      console.log("Voting finalized:", tx);
    } catch (error) {
      console.error("Error finalizing voting:", error);
    } finally {
      console.log("Finalize voting completed");
      setFinalizedClicked(true);
      fetchWinningValues()
    }
  };

  const fetchWinningValues = async () => {
    try {
      const [uint8Value, uint16Value] = await votingContract.winning();
      setWinningValues({ uint8Value, uint16Value });
      console.log("Winning values:", { uint8Value, uint16Value });
    } catch (error) {
      console.error("Error fetching winning values:", error);
    }
  };

  // TODO fetch voting options
  // These can be fetched from the contract as well, but for simplicity and time limits, we are hardcoding them here
  const options = ["Patrick Star", "Sandy Cheeks", "Mr. Krabs"]

  return (
    <>
      <main className='fixed w-full flex flex-col items-center justify-center p-10 bg-gradient-to-b '>
        <div>
          <h1 className='text-3xl font-bold py-5'>FHE Voting</h1>
        </div>

        {/* FORM */}
        {finalized ? (
        <div className="w-full max-w-md bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-center text-green-500 font-bold">Voting has been finalized!</p>
          <p className="text-center text-gray-700">{proposalName}</p>
          <p className="text-center text-gray-700">With {winningValues.uint16Value} Votes...</p>
          <p className="text-center text-gray-700 font-bold">The Winning Character is: {options[winningValues.uint8Value]} 🎉</p>
        </div>
      ) : (
        <>
          {isSubmitted ? (
            <div className='w-full max-w-md bg-white p-6 rounded-lg shadow-md'>
              <p className='text-center text-green-500 font-bold'>Your vote has been submitted!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='w-full max-w-md bg-gradient-to-b  p-6 rounded-lg shadow-md'>
              <div className='mb-4'>
                <p className='block text-gray-100 text-sm font-bold mb-2'>{proposalName}</p>
                <div className='flex items-center mb-2'>
                  <input
                    id='option0'
                    type='radio'
                    name='voteOption'
                    value='0'
                    checked={selectedOption === 0}
                    onChange={() => setSelectedOption(0)}
                    className='mr-2 leading-tight'
                  />
                  <label htmlFor='option0' className='text-gray-100'>
                    {options[0]}
                  </label>
                </div>
                <div className='flex items-center mb-2'>
                  <input
                    id='option1'
                    type='radio'
                    name='voteOption'
                    value='1'
                    checked={selectedOption === 1}
                    onChange={() => setSelectedOption(1)}
                    className='mr-2 leading-tight'
                  />
                  <label htmlFor='option1' className='text-gray-100'>
                  {options[1]}
                  </label>
                </div>
                <div className='flex items-center'>
                  <input
                    id='option2'
                    type='radio'
                    name='voteOption'
                    value='2'
                    checked={selectedOption === 2}
                    onChange={() => setSelectedOption(2)}
                    className='mr-2 leading-tight'
                  />
                  <label htmlFor='option2' className='text-gray-100'>
                  {options[2]}
                  </label>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <button
                  type='submit'
                  className='rounded-xl border border-slate-500 bg-gradient-to-b from-zinc-800/30 to-zinc-500/40 p-4 text-white font-bold focus:outline-none focus:shadow-outline'
                >
                  Submit Vote
                </button>
              </div>
            </form>
          )}
        </>
      )}

        {/* Footer */}
        <div className='fixed bottom-0 w-full flex justify-center py-10 bg-gradient-to-b '>
      <div className='flex space-x-5'>
        <p className='rounded-xl border border-slate-500 bg-gradient-to-b from-zinc-800/30 to-zinc-500/40 p-4 flex items-center text-xs'>
          Voting Contract: {votingAddress}
        </p>
        <div className='rounded-xl text-xs border border-slate-500 bg-gradient-to-b from-zinc-800/30 to-zinc-500/40 p-4 flex flex-col'>
          <p>Watching Blocks on {chainId ? chainId : 'Loading...'}</p>
          <div className='flex items-center justify-center space-x-2'>
            <div className='relative'>
              <div
                className={`absolute inline-flex h-full w-full rounded-full ${
                  blockNumberData ? 'bg-green-500' : 'bg-orange-500'
                } opacity-75 animate-ping`}
              ></div>
              <div
                className={`relative h-2 w-2 rounded-full ${blockNumberData ? 'bg-green-500' : 'bg-orange-500'}`}
              ></div>
            </div>
            <p>{blockNumberData ? Number(blockNumberData) : 'Loading...'}</p>
          </div>
        </div>
        {!finalized && (
            <button
              onClick={handleFinalizeVoting}
              className='rounded-xl text-xs border border-slate-500 bg-gradient-to-b from-zinc-800/30 to-zinc-500/40 p-4 flex items-center justify-center'
            >
              Finalize Voting
            </button>
          )}
      </div>
    </div>
          </main>
    </>
  )
}
