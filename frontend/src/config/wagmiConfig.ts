import { createConfig, http } from 'wagmi'
import { mainnet, arbitrum } from 'wagmi/chains'
import { connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { phantomWallet } from '@rainbow-me/rainbowkit/wallets'

const { wallets } = getDefaultWallets()
const appName = 'evm-bootstrap-repo'
const projectId = 'walletConnectId(NeedsReplacing)'

const connectors = connectorsForWallets(
  [
    ...wallets,
    {
      groupName: 'Popular',
      wallets: [phantomWallet],
    },
  ],
  {
    appName,
    projectId,
  },
)

import type { Chain } from 'viem'


const fhenix = {
  id: 42069,
  name: 'Fhenix Testnet',
  nativeCurrency: { name: 'FHE', symbol: 'tFHE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.testnet.fhenix.zone:7747'] },
    // default: { http: ['http://127.0.0.1:42069'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.testnet.fhenix.zone' },
  },
  contracts: {
    ensRegistry: {
      address: '0x0',
    },
    ensUniversalResolver: {
      address: '0x0',
      blockCreated: 16773775,
    },
    multicall3: { // not supported?
      address: "0x",
      blockCreated: 8123891232939923,
    },
  },
} as const satisfies Chain


export const wagmiConfig = createConfig({
  chains: [fhenix],
  ssr: true,
  connectors: connectors,
  transports: {
    // [mainnet.id]: http(),
    [fhenix.id]: http(),
  },
})

// testnet
export const votingAddress = "0xc160BF640D293809f0ffDd71B44bA32dBE35E498"

// localhost
// export const votingAddress = "0xbeb4eF1fcEa618C6ca38e3828B00f8D481EC2CC2"