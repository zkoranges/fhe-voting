'use client'
import React, { useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';
import Link from 'next/link';

import { votingAddress } from '@/config/wagmiConfig';
import Footer from '../components/Footer'; // Adjust the import path as needed
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
          const uint8Array = (await fheClient.encrypt_uint8(value)).data;
          return `0x${Array.from(uint8Array).map(b => b.toString(16).padStart(2, '0')).join('')}`;
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
    const tx = await votingContract.connect(signer).vote(encryptedVote);

    // Set the submitted state to true
    setIsSubmitted(true);
  };


  const handleFinalizeVoting = () => {
    // Add the logic to finalize the voting process
    console.log('Finalize Voting button clicked');
  };

  return (
    <>
      <main className='fixed w-full flex flex-col items-center justify-center p-10 bg-gradient-to-b '>
        <div>
          <h1 className='text-3xl font-bold py-5'>FHE Voting</h1>
          <p>Name of proposal: {proposalName}</p>
        </div>

        {isSubmitted ? (
          <div className='w-full max-w-md bg-white p-6 rounded-lg shadow-md'>
            <p className='text-center text-green-500 font-bold'>Your vote has been submitted!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='w-full max-w-md bg-gradient-to-b  p-6 rounded-lg shadow-md'>
            <div className='mb-4'>
              <p className='block text-gray-100 text-sm font-bold mb-2'>Select an option:</p>
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
                  Option 0
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
                  Option 1
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
                  Option 2
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

        {/* Footer */}
        <Footer votingAddress={votingAddress} />
      </main>
    </>
  )
}
