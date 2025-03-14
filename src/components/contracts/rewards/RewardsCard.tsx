import styled from 'styled-components';

const CardWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1.5rem;
  box-sizing: border-box;
`;

const Card = styled.div`
  width: 100%;
  max-width: 24rem;
  margin: 0 auto;
  background: linear-gradient(135deg, #537b83 0%, #6b959d 50%, #84b0b8 100%);
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ProtocolSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
`;

const LogoContainer = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const Logo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const ProtocolInfo = styled.div`
  flex: 1;
`;

const ProtocolName = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  color: #FFFFFF;
  font-weight: 600;
`;

const PointsSection = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 1.5rem;
  text-align: center;
`;

const PointsLabel = styled.div`
  font-size: 0.875rem;
  color: #e5f0f0;
  margin-bottom: 0.5rem;
`;

const PointsValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #FFFFFF;
`;

// Add a new styled component for the lock time
const LockTime = styled.div`
  font-size: 0.75rem;
  color: #e5f0f0;
  opacity: 0.8;
  margin-top: 0.5rem;
`;

const SAMPLE_PROTOCOLS = [
  {
    name: "Caribou",
    points: 0,
    logo: "/caribou_logo.jpg",
    pointsLabel: "Total Points Earned"
  },
  {
    name: "Scroll Marks",
    points: 0,
    logo: "/scroll.png",
    pointsLabel: "Total Marks Earned"
  },
  {
    name: "Nuri Exchange",
    points: 1000,
    pointsSuffix: "veNuri",
    logo: "https://dd.dexscreener.com/ds-data/tokens/scroll/0xaaae8378809bb8815c08d3c59eb0c7d1529ad769.png",
    pointsLabel: "veNuri awarded",
    lockTime: "08/03/2029 - 4 Year Lock"
  }
];

export const RewardsCard = ({ contractIndex }: { contractIndex: number }) => {
  const protocol = SAMPLE_PROTOCOLS[contractIndex] || SAMPLE_PROTOCOLS[0];

  return (
    <CardWrapper>
      <Card>
        <ProtocolSection>
          <LogoContainer>
            <Logo src={protocol.logo} alt={`${protocol.name} logo`} />
          </LogoContainer>
          <ProtocolInfo>
            <ProtocolName>{protocol.name}</ProtocolName>
          </ProtocolInfo>
        </ProtocolSection>
        
        <PointsSection>
          <PointsLabel>{protocol.pointsLabel}</PointsLabel>
          <PointsValue>
            {protocol.points.toLocaleString()}
            {protocol.pointsSuffix ? ` ${protocol.pointsSuffix}` : ''}
          </PointsValue>
          {protocol.lockTime && <LockTime>{protocol.lockTime}</LockTime>}
        </PointsSection>
      </Card>
    </CardWrapper>
  );
}; 