import styled from 'styled-components';
import { useAppKitAccount, useAppKitNetworkCore, useAppKitProvider, type Provider } from '@reown/appkit/react';
import { BrowserProvider, JsonRpcSigner, Contract } from 'ethers';

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
`;

const NFTImage = styled.img`
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

interface ContractConfig {
  address: string;
  abi: string[];
  name: string;
  imageUrl?: string;
}

// Contract configurations
const CONTRACTS: ContractConfig[] = [
  {
    name: "Caribou NFT",
    address: "0x36f4fa06Bbc44910F21db31B754fd91A699dD961",
    abi: [
      "function safeMint(address to) public"
    ],
    imageUrl: "https://ipfs.io/ipfs/QmQicuf49WKck1YxranWF4UPMdungQYDvrZPsnG6TY8WTM/caribou_nft.jpg"
  },
  {
    name: "Scroll Tarot NFT",
    address: "0x46597C6ae7a02a17038a53a207eEdaDDF565B11f",
    abi: [
      "function safeMint(address to) public"
    ],
    imageUrl: "/scroll_tarot.jpg"
  },
  {
    name: "The Maze",
    address: "0xD85F3617D147a71e5482CC2Dd789E8bB0A29E04C",
    abi: [
      "function safeMint(address to) public"
    ],
    imageUrl: "/scroll_maze.jpg"
  }
];

interface MintContractCardProps {
  sendHash: (hash: string) => void;
  contractIndex: number;
}

export const MintContractCard = ({ sendHash, contractIndex }: MintContractCardProps) => {
  // Add safety check for contract index
  if (contractIndex >= CONTRACTS.length) {
    return (
      <CardContent>
        <CardTitle>No Contract Available</CardTitle>
      </CardContent>
    );
  }

  const contract = CONTRACTS[contractIndex];
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetworkCore();
  const { walletProvider } = useAppKitProvider<Provider>('eip155');

  const handleMint = async () => {
    if (!walletProvider || !address) throw Error('user is disconnected');

    const provider = new BrowserProvider(walletProvider, chainId);
    const signer = new JsonRpcSigner(provider, address);
    
    const contractInstance = new Contract(contract.address, contract.abi, signer);
    
    try {
      const tx = await contractInstance.safeMint(address);
      sendHash(tx.hash);
    } catch (error) {
      console.error("Failed to mint NFT:", error);
    }
  };

  return (
    <CardContent>
      <CardTitle>{contract.name}</CardTitle>
      {contract.imageUrl && (
        <NFTImage src={contract.imageUrl} alt={contract.name} />
      )}
      <ButtonContainer>
        <button onClick={handleMint}>Mint NFT</button>
      </ButtonContainer>
    </CardContent>
  );
}; 