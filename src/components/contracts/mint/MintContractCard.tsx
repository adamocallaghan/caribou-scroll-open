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
const CONTRACT_1: ContractConfig = {
  name: "Caribou NFT",
  address: "0x36f4fa06Bbc44910F21db31B754fd91A699dD961",
  abi: [
    "function safeMint(address to) public"
  ],
  imageUrl: "https://ipfs.io/ipfs/QmQicuf49WKck1YxranWF4UPMdungQYDvrZPsnG6TY8WTM/caribou_nft.jpg"
};

interface MintContractCardProps {
  sendHash: (hash: string) => void;
  contract?: ContractConfig;
}

export const MintContractCard = ({ sendHash, contract = CONTRACT_1 }: MintContractCardProps) => {
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