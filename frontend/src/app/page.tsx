'use client'
import Link from 'next/link'

import { votingAddress } from '@/config/wagmiConfig'
import Footer from '../components/Footer'; // Adjust the import path as needed

// Landing page localhost:3000/

export default function LandingPage() {


  return (
    <>
      <main className='fixed w-full flex justify-center p-10 bg-gradient-to-b'>
        <div>
          <h1 className='text-3xl font-bold py-5'>FHE Voting</h1>
        </div>


       {/* Footer */}
        <Footer votingAddress={votingAddress} />
      </main>
    </>
  )
}
