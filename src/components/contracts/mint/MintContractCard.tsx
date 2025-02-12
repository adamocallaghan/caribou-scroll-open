import { useState } from 'react';
import styled from 'styled-components';
import { useAppKitAccount, useAppKitNetworkCore, useAppKitProvider, type Provider } from '@reown/appkit/react';
import { BrowserProvider, JsonRpcSigner, Contract } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';

// Wrapper to handle the 3D perspective
const CardWrapper = styled.div`
  perspective: 1000px;
  width: 100%;
  height: 100dvh;
  max-height: 100dvh;
  overflow: auto;
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
`;

const FlipButton = styled.button`
  position: absolute;
  bottom: max(20px, env(safe-area-inset-bottom));
  right: max(20px, env(safe-area-inset-right));
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  
  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
    bottom: calc(env(safe-area-inset-bottom) + 60px);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: invert(89%) sepia(11%) saturate(595%) hue-rotate(190deg) brightness(103%) contrast(103%);
  }
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

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #dee6ff;  // Using the text color for background
  color: #143199;            // Using the card background color for text
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export const MintContractCard = ({ sendHash, contractIndex }: MintContractCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Add safety check for contract index
  if (contractIndex >= CONTRACTS.length) {
    return (
      <CardWrapper>
        <FlipContainer isFlipped={isFlipped}>
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
    <CardWrapper>
      <FlipContainer isFlipped={isFlipped}>
        <CardFront>
          <Toaster 
            position="bottom-center"
            toastOptions={{
              duration: 5000,
              style: {
                minWidth: '250px',
                maxWidth: '500px',
                padding: '16px',
                textAlign: 'center',
              },
            }}
          />
          <CardTitle>{contract.name}</CardTitle>
          {contract.imageUrl && (
            <NFTImage src={contract.imageUrl} alt={contract.name} />
          )}
          <ButtonContainer>
            <Button onClick={handleMint}>Mint NFT</Button>
          </ButtonContainer>
          <FlipButton onClick={() => setIsFlipped(!isFlipped)}>
            <img src="/flip-over.svg" alt="Flip card" />
          </FlipButton>
        </CardFront>
        <CardBack>
          <div>This NFT collection...</div>
          <FlipButton onClick={() => setIsFlipped(!isFlipped)}>
            <img src="/flip-over.svg" alt="Flip card" />
          </FlipButton>
        </CardBack>
      </FlipContainer>
    </CardWrapper>
  );
}; 