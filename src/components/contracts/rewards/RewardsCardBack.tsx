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
`;

const Title = styled.h3`
  color: #FFFFFF;
  font-size: 1.25rem;
  margin: 0 0 1rem 0;
`;

const Description = styled.p`
  color: #e5f0f0;
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SubTitle = styled.h4`
  color: #FFFFFF;
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
  opacity: 0.9;
`;

const getRewardDescription = (protocolName: string) => {
  switch (protocolName) {
    case 'Caribou':
      return {
        title: 'Caribou Points',
        what: 'Caribou Points are loyalty rewards that demonstrate your active participation in the Caribou ecosystem.',
        how: 'Earn points by actively engaging with the app: making trades, providing liquidity, participating in governance, and completing daily tasks.',
        benefits: 'Points can be used for governance voting, accessing exclusive features, and potential future token airdrops.'
      };
    case 'Scroll Marks':
      return {
        title: 'Scroll Marks',
        what: 'Scroll Marks track your engagement with DeFi protocols on the Scroll network.',
        how: 'Earn marks by depositing assets into verified DeFi protocols, participating in liquidity pools, and maintaining active positions.',
        benefits: 'Marks contribute to your overall Scroll reputation and may qualify you for network incentives and rewards.'
      };
    case 'Nuri Exchange':
      return {
        title: 'veNuri Tokens',
        what: 'veNuri is the governance token of Nuri Exchange, representing your locked voting power.',
        how: 'Lock NURI tokens for a period of time (up to 4 years) to receive veNuri. Longer locks result in more voting power.',
        benefits: 'Use veNuri to vote on bribed pools, earning a share of trading fees and external rewards from protocols.'
      };
    default:
      return {
        title: 'Rewards Program',
        what: 'Platform rewards for active participation.',
        how: 'Engage with the protocol to earn rewards.',
        benefits: 'Use rewards for governance and special features.'
      };
  }
};

interface RewardsCardBackProps {
  protocolName: string;
}

export const RewardsCardBack = ({ protocolName }: RewardsCardBackProps) => {
  const info = getRewardDescription(protocolName);

  return (
    <CardWrapper>
      <Card>
        <Title>{info.title}</Title>
        <Section>
          <SubTitle>What are they?</SubTitle>
          <Description>{info.what}</Description>
        </Section>
        <Section>
          <SubTitle>How to earn?</SubTitle>
          <Description>{info.how}</Description>
        </Section>
        <Section>
          <SubTitle>Benefits</SubTitle>
          <Description>{info.benefits}</Description>
        </Section>
      </Card>
    </CardWrapper>
  );
}; 