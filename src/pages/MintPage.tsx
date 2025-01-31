import styled from 'styled-components';
import { useAppKitAccount, useAppKitNetworkCore, useAppKitProvider, type Provider } from '@reown/appkit/react';
import { BrowserProvider, JsonRpcSigner, Contract } from 'ethers';

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const PageTitle = styled.h1`
  margin: 0;
`;

const CONTRACT_ABI = [
  "function mintAllocation(address _to) external"
];

const CONTRACT_ADDRESS = "0x5F411dDd510eD65b4942d36CaaF3b8636047308B";

interface MintPageProps {
  sendHash: (hash: string) => void;
}

export const MintPage = ({ sendHash }: MintPageProps) => {
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetworkCore();
  const { walletProvider } = useAppKitProvider<Provider>('eip155');

  const handleMintAllocation = async () => {
    if (!walletProvider || !address) throw Error('user is disconnected');

    const provider = new BrowserProvider(walletProvider, chainId);
    const signer = new JsonRpcSigner(provider, address);
    
    const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    try {
      const tx = await contract.mintAllocation(address);
      sendHash(tx.hash);
    } catch (error) {
      console.error("Failed to mint allocation:", error);
    }
  };

  return (
    <PageContent>
      <PageTitle>Mint</PageTitle>
      <button onClick={handleMintAllocation}>Mint Allocation</button>
    </PageContent>
  );
}; 