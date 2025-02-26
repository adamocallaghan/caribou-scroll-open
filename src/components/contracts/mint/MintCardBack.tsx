import styled from 'styled-components';

const CardWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1.5rem;
  box-sizing: border-box;
  margin-top: 30px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 24rem;
  height: 420px;
  margin: 0 auto;
  background: linear-gradient(135deg, #FFA6A6 0%, #fdf2f8 100%);
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CardContent = styled.div`
  padding: 1.5rem;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  color: #333333;
  margin: 0 0 1.5rem 0;
  font-weight: 600;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #4A4A4A;
  margin: 0;
  line-height: 1.6;
  max-width: 80%;
`;

interface MintCardBackProps {
  contractIndex: number;
}

export const MintCardBack = ({ contractIndex }: MintCardBackProps) => {
  const getCardContent = (index: number) => {
    switch (index) {
      case 0:
        return {
          title: "About This Collection",
          description: "This NFT collection represents your stake in the Caribou protocol. Each NFT is unique and provides proof of your participation in the protocol's early stages. Holding this NFT may grant you special privileges and rewards in the future of the Caribou ecosystem."
        };
      case 1:
        return {
          title: "Scroll Tarot Community",
          description: "The Scroll Tarot NFT is your key to an exclusive community of DeFi strategists and traders. Holders gain access to daily market analysis, trading signals, and collaborative strategy sessions. Join fellow holders in discovering new opportunities across the Scroll ecosystem."
        };
      case 2:
        return {
          title: "Enter The Maze",
          description: "Welcome to The Maze - Scroll's premier GameFi experience. This NFT serves as your permanent access pass to an immersive strategy game built on Scroll. Navigate through dynamic mazes, solve blockchain puzzles, and compete with other players for rewards."
        };
      default:
        return {
          title: "Collection Information",
          description: "Information about this NFT collection is not available."
        };
    }
  };

  const content = getCardContent(contractIndex);

  return (
    <CardWrapper>
      <Card>
        <CardContent>
          <Title>{content.title}</Title>
          <Description>{content.description}</Description>
        </CardContent>
      </Card>
    </CardWrapper>
  );
}; 