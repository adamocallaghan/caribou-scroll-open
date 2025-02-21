import styled from 'styled-components';

const Card = styled.div`
  width: 100%;
  max-width: 24rem;
  margin: 0 auto;
  border-radius: 0.5rem;
  overflow: hidden;
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

interface EarnCardV2Props {
  poolName: string;
  apr: string;
  available: string;
  supplied: string;
  symbol: string;
}

export const EarnCardV2 = ({ poolName, apr, available, supplied, symbol }: EarnCardV2Props) => {
  return (
    <Card>
      <GradientBackground>
        <CardHeader>
          <IconContainer>
            <IconBadge>
              <CoinIcon />
            </IconBadge>
            <PoolName>RHO Markets</PoolName>
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