import styled from 'styled-components';

const Card = styled.div`
  width: 100%;
  max-width: 24rem;
  margin: 0 auto;
  background: linear-gradient(135deg, #537b83 0%, #6b959d 50%, #84b0b8 100%);
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CardContent = styled.div`
  padding: 1.5rem;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  width: 2.5rem;
  height: 2.5rem;
  object-fit: contain;
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

interface RewardsCardProps {
  protocolName: string;
  points: number;
  logoUrl: string;
  contractIndex: number;
}

// Sample protocol data - in a real app, this would come from your backend
const SAMPLE_PROTOCOLS = [
  {
    name: "Caribou Protocol",
    points: 1250,
    logo: "/caribou-logo.svg"
  },
  {
    name: "Scroll Exchange",
    points: 850,
    logo: "/scroll-logo.svg"
  },
  {
    name: "Reown Finance",
    points: 2100,
    logo: "/reown-logo.svg"
  },
  {
    name: "DeFi Points",
    points: 1500,
    logo: "/defi-logo.svg"
  }
];

export const RewardsCard = ({ contractIndex }: { contractIndex: number }) => {
  // Get protocol data based on contract index
  const protocol = SAMPLE_PROTOCOLS[contractIndex] || SAMPLE_PROTOCOLS[0];

  return (
    <Card>
      <CardContent>
        <ProtocolSection>
          <LogoContainer>
            <Logo src={protocol.logo} alt={`${protocol.name} logo`} />
          </LogoContainer>
          <ProtocolInfo>
            <ProtocolName>{protocol.name}</ProtocolName>
          </ProtocolInfo>
        </ProtocolSection>
        
        <PointsSection>
          <PointsLabel>Total Points Earned</PointsLabel>
          <PointsValue>{protocol.points.toLocaleString()}</PointsValue>
        </PointsSection>
      </CardContent>
    </Card>
  );
}; 