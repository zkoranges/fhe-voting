import React from 'react';
import { useBlockNumber } from 'wagmi'
import { useChainId } from 'wagmi'

interface FooterProps {
  votingAddress: string;
}

const Footer: React.FC<FooterProps> = ({ votingAddress }) => {
    const blockNumber = useBlockNumber({
        watch: true,
      })
    
      const chainId = useChainId() 

  return (
    <div className='fixed bottom-0 w-full flex justify-center p-4 bg-gradient-to-b'>
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
                  blockNumber.data ? 'bg-green-500' : 'bg-orange-500'
                } opacity-75 animate-ping`}
              ></div>
              <div
                className={`relative h-2 w-2 rounded-full ${blockNumber.data ? 'bg-green-500' : 'bg-orange-500'}`}
              ></div>
            </div>
            <p>{blockNumber.data ? Number(blockNumber.data) : 'Loading...'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
