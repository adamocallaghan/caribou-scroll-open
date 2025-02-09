import { scroll, scrollSepolia } from '@reown/appkit/networks'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'

// Get projectId from https://cloud.reown.com
export const projectId = import.meta.env.VITE_PROJECT_ID || "b56e18d47c72ab683b10814fe9495694"

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Create a metadata object
export const metadata = {
  name: 'Caribou',
  description: 'Caribou App',
  url: 'https://caribou-scroll-open.vercel.app', // Update to match your deployed URL
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// for custom networks visit -> https://docs.reown.com/appkit/react/core/custom-networks
export const networks = [scroll, scrollSepolia] as [AppKitNetwork, ...AppKitNetwork[]]
// export const networks = [mainnet, arbitrum, sepolia, scrollSepolia] as [AppKitNetwork, ...AppKitNetwork[]]

// Set up Solana Adapter
export const ethersAdapter = new EthersAdapter();