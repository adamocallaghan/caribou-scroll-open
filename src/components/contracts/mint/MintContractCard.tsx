import styled from 'styled-components';
import { useAppKitAccount, useAppKitNetworkCore, useAppKitProvider, type Provider } from '@reown/appkit/react';
import { BrowserProvider, JsonRpcSigner, Contract } from 'ethers';
import toast from 'react-hot-toast';
import { ToastPortal } from '../../Toast';
import { MintCardV2 } from './MintCardV2';

// Wrapper to handle the 3D perspective
const CardWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
`;

// Container for the flip animation
const FlipContainer = styled.div<{ isFlipped: boolean }>`
  position: relative;
  width: 100%;
  min-height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  transform: ${props => props.isFlipped ? 'rotateY(180deg)' : 'rotateY(0)'};
`;

// Front of card
const CardFront = styled.div`
  position: absolute;
  width: 100%;
  min-height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  padding-top: 80px;
  padding-bottom: 80px;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
`;

// Back of card
const CardBack = styled.div`
  position: absolute;
  width: 100%;
  min-height: 100%;
  backface-visibility: hidden;
  transform: rotateY(180deg);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  padding-top: 80px;
  padding-bottom: 80px;
  text-align: center;
  font-size: 1.2rem;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
`;

const toastStyles = {
  loading: {
    style: {
      background: '#FF9800',
      color: 'white',
    },
  },
  success: {
    style: {
      background: '#4CAF50',
      color: 'white',
    },
  },
  error: {
    style: {
      background: '#F44336',
      color: 'white',
    },
  },
};

// Export the ContractConfig type
export interface ContractConfig {
  name: string;
  address: string;
  abi: string[];
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
    imageUrl: "https://cdn.leonardo.ai/users/5fa161d0-2570-4088-9b52-3ce39109b665/generations/1a0ebae2-90bf-496f-9423-cb68065234d5/Leonardo_Phoenix_10_A_stylized_geometrically_represented_Carib_0.jpg"
  },
  {
    name: "Scroll Tarot NFT",
    address: "0x46597C6ae7a02a17038a53a207eEdaDDF565B11f",
    abi: [
      "function safeMint(address to) public"
    ],
    imageUrl: "https://cdn.leonardo.ai/users/5fa161d0-2570-4088-9b52-3ce39109b665/generations/4fd356d0-12fb-4d06-a715-abd59c3e057e/Leonardo_Phoenix_10_A_vintage_style_tarot_card_with_the_word_S_1.jpg"
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
      <CardWrapper>
        <FlipContainer isFlipped={false}>
          <CardFront>
            <CardTitle>No Contract Available</CardTitle>
          </CardFront>
          <CardBack>
            <div>No Contract Available</div>
          </CardBack>
        </FlipContainer>
      </CardWrapper>
    );
  }

  const contract = CONTRACTS[contractIndex];
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetworkCore();
  const { walletProvider } = useAppKitProvider<Provider>('eip155');

  const handleMint = async () => {
    if (!walletProvider || !address) throw Error('user is disconnected');

    const loadingToast = toast.loading('Minting NFT...', toastStyles.loading);
    
    try {
      const provider = new BrowserProvider(walletProvider, chainId);
      const signer = new JsonRpcSigner(provider, address);
      
      const contractInstance = new Contract(contract.address, contract.abi, signer);
      
      const tx = await contractInstance.safeMint(address);
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        toast.success('NFT minted successfully!', { 
          id: loadingToast,
          ...toastStyles.success 
        });
        sendHash(tx.hash);
      } else {
        toast.error('Minting failed', { 
          id: loadingToast,
          ...toastStyles.error 
        });
      }
    } catch (error) {
      console.error("Failed to mint NFT:", error);
      toast.error('Failed to mint NFT', { 
        id: loadingToast,
        ...toastStyles.error 
      });
    }
  };

  return (
    <>
      <ToastPortal />
      <CardWrapper>
        <MintCardV2 
          onMint={handleMint} 
          contract={contract}
        />
      </CardWrapper>
    </>
  );
}; 