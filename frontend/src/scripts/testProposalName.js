const { ethers } = require('ethers')

// Configuration
const RPC_URL = 'https://api.testnet.fhenix.zone:7747'
const CONTRACT_ADDRESS = '0x8Ca7Fa9f769bEec27b600FE815B6eC1765D66828'

// Contract ABI
const abi = [
  // Public state variable getter for 'proposal'
  {
    constant: true,
    inputs: [],
    name: 'proposal',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    type: 'function',
  },
]

async function fetchProposal() {
  // Set up the provider
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL)

  // Create a contract instance
  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider)

  try {
    // Fetch the proposal variable
    const proposal = await contract.proposal()
    console.log('Proposal:', proposal)
  } catch (error) {
    console.error('Error fetching proposal:', error)
  }
}

// Execute the function
fetchProposal()
