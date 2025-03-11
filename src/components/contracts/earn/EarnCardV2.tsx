import styled from 'styled-components';
import { useState } from 'react';

const Card = styled.div`
  width: 100%;
  max-width: 24rem;
  margin: 0 auto;
  border-radius: 0.5rem;
  overflow: visible;
  position: relative;
`;

const GradientBackground = styled.div`
  background: linear-gradient(135deg, #f3c86c 0%, #ffecd1 50%, #fff6e5 100%);
  position: relative;
  padding: 1.5rem;
`;

const CardHeader = styled.div`
  margin-bottom: 0.5rem;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

const IconBadge = styled.div`
  background: rgba(243, 200, 108, 0.1);
  padding: 0.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
`;

const PoolName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #b17d1a;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #222222;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const APR = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: #15803d;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
`;

const StatBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StatLabel = styled.p`
  font-size: 0.875rem;
  color: #666666;
`;

const StatValue = styled.p`
  font-family: monospace;
  font-size: 1.125rem;
  font-weight: 500;
  color: #222222;
`;

const TokenSymbol = styled.span`
  font-size: 0.875rem;
  font-weight: normal;
  color: #666666;
`;

// Decorative elements
const DecorativeCircle = styled.div<{ position: 'top' | 'bottom' }>`
  position: absolute;
  border-radius: 9999px;
  background: rgba(243, 200, 108, 0.05);
  
  ${props => props.position === 'top' ? `
    width: 4rem;
    height: 4rem;
    left: -1rem;
    top: -1rem;
  ` : `
    width: 6rem;
    height: 6rem;
    right: -2rem;
    bottom: -2rem;
  `}
`;

// Add SVG component for the coin icon
const CoinIcon = () => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="#b17d1a" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="8" cy="8" r="7" />
    <circle cx="16" cy="16" r="7" />
  </svg>
);

const InfoIconContainer = styled.div<{ isBack?: boolean }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
  z-index: 20;
  color: #b17d1a;
  background: rgba(243, 200, 108, 0.1);
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: ${props => props.isBack ? 'rotateY(180deg)' : 'rotateY(0)'};

  &:hover {
    opacity: 0.8;
  }
`;

const InfoIcon = () => (
  <svg 
    width="20" 
    height="20" 
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

const Tooltip = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: auto;
  bottom: -0.5rem;
  transform: translateY(100%);
  right: 1rem;
  width: 280px;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 0.5rem;
  color: white;
  font-size: 0.875rem;
  line-height: 1.4;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: opacity 0.2s, visibility 0.2s;
  z-index: 30;
  pointer-events: ${props => props.isVisible ? 'auto' : 'none'};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const getMarketDescription = (poolName: string) => {
  switch (poolName) {
    case 'USDC Lending Pool':
      return "This market enables USDC deposits which can be borrowed by other users. The protocol maintains strict collateralization ratios and liquidation mechanisms to protect lenders, though smart contract risks apply.";
    case 'USDT Lending Pool':
      return "This market enables USDT deposits which can be borrowed by other users. The protocol maintains strict collateralization ratios and liquidation mechanisms to protect lenders, though smart contract risks apply.";
    case 'USDC-ETH LP Pool':
      return "This liquidity pool allows you to earn fees by providing USDC and ETH liquidity for traders. Your returns come from trading fees, but be aware of impermanent loss and smart contract risks.";
    default:
      return "This market allows you to earn yield by providing liquidity. Always be aware of smart contract risks when depositing funds.";
  }
};

interface EarnCardV2Props {
  poolName: string;
  apr: string;
  available: string;
  supplied: string;
  symbol: string;
  protocol: string;
  isBack?: boolean;
}

export const EarnCardV2 = ({ 
  poolName, 
  apr, 
  available, 
  supplied, 
  symbol, 
  protocol,
  isBack = false
}: EarnCardV2Props) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Card>
      <GradientBackground>
        <InfoIconContainer isBack={isBack} onClick={() => setShowTooltip(!showTooltip)}>
          <InfoIcon />
        </InfoIconContainer>
        <Tooltip isVisible={showTooltip && !isBack}>
          {getMarketDescription(poolName)}
        </Tooltip>
        <CardHeader>
          <IconContainer>
            <IconBadge>
              <CoinIcon />
            </IconBadge>
            <PoolName>{protocol}</PoolName>
          </IconContainer>
          <Title>
            {poolName}
            <APR>{apr}%</APR>
          </Title>
        </CardHeader>

        <StatsGrid>
          <StatBox>
            <StatLabel>Available</StatLabel>
            <StatValue>
              ${available} <TokenSymbol>{symbol}</TokenSymbol>
            </StatValue>
          </StatBox>
          <StatBox>
            <StatLabel>Supplied</StatLabel>
            <StatValue>
              ${supplied} <TokenSymbol>{symbol}</TokenSymbol>
            </StatValue>
          </StatBox>
        </StatsGrid>

        <DecorativeCircle position="top" />
        <DecorativeCircle position="bottom" />
      </GradientBackground>
    </Card>
  );
}; 