import styled from 'styled-components';
import { useState } from 'react';
import { ContractConfig } from './MintContractCard';  // You might need to export this type

// SVG Icons as components
const LoaderIcon = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="animate-spin"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const CheckIcon = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const InfoIcon = () => (
  <svg 
    width="12" 
    height="12" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const Card = styled.div`
  width: 100%;
  max-width: 24rem;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #FFA6A6 0%, #fdf2f8 100%);  // Start with exact card color, fade to light pink
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  padding: 1rem 1.5rem;
  padding-bottom: 0.75rem;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #f8fafc;  // Slightly softer white
`;

const PriceBadge = styled.span`
  background: rgba(255, 255, 255, 0.15);  // More transparent
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #f8fafc;  // Slightly softer white
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Badge = styled.span`
  border: 1px solid rgba(255, 255, 255, 0.2);  // More transparent
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #f8fafc;  // Slightly softer white

  svg {
    stroke: #f8fafc;  // Slightly softer white
  }
`;

const ImageContainer = styled.div`
  position: relative;
  aspect-ratio: 1;
  width: 80%;
  max-width: 280px;
  margin: 0 auto;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0.5rem;
    transition: transform 0.2s;
    
    &:hover {
      transform: scale(1.02);
    }
  }

  @media (max-width: 768px) {
    width: 70%;
    max-width: 220px;
  }
`;

const CardFooter = styled.div`
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`;

const MintButton = styled.button<{ $isMinting?: boolean; $isSuccess?: boolean }>`
  width: 100%;
  padding: 0.875rem;
  margin: 0 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 500;
  color: white;
  background: ${props => 
    props.$isSuccess 
      ? '#10B981'
      : 'linear-gradient(to right, #9333ea, #db2777)'
  };
  cursor: ${props => (props.$isMinting || props.$isSuccess) ? 'not-allowed' : 'pointer'};
  opacity: ${props => (props.$isMinting || props.$isSuccess) ? 0.7 : 1};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-sizing: border-box;
  width: calc(100% - 3rem);
  
  &:hover:not(:disabled) {
    background: linear-gradient(to right, #7c28cd, #be185d);
  }
`;

interface MintCardV2Props {
  onMint: () => Promise<void>;
  contract: ContractConfig;  // Add contract prop
}

export const MintCardV2 = ({ onMint, contract }: MintCardV2Props) => {
  const [isMinting, setIsMinting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleMint = async () => {
    try {
      setIsMinting(true);
      await onMint();
      setIsSuccess(true);
    } catch (error) {
      console.error("Minting failed:", error);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <HeaderTop>
          <Title>{contract.name}</Title>
          <PriceBadge>1 ETH</PriceBadge>
        </HeaderTop>
        <BadgeContainer>
          <Badge>Limited Edition</Badge>
          <Badge>
            <InfoIcon />
            100 Available
          </Badge>
        </BadgeContainer>
      </CardHeader>
      
      <ImageContainer>
        <img
          src={contract.imageUrl}
          alt={`${contract.name} artwork`}
        />
      </ImageContainer>
      
      <CardFooter>
        <MintButton
          onClick={handleMint}
          disabled={isMinting || isSuccess}
          $isMinting={isMinting}
          $isSuccess={isSuccess}
        >
          {isMinting ? (
            <>
              <LoaderIcon />
              Minting...
            </>
          ) : isSuccess ? (
            <>
              <CheckIcon />
              Minted Successfully
            </>
          ) : (
            "Mint NFT"
          )}
        </MintButton>
      </CardFooter>
    </Card>
  );
}; 