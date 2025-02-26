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
  margin: 0 auto;
  background: linear-gradient(135deg, #48466D 0%, #6B6992 50%, #E6A4B4 100%);
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CardContent = styled.div`
  padding: 1.5rem;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  color: #FFFFFF;
  margin: 0 0 1rem 0;
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: #FF69B4;
  margin: 0;
  line-height: 1.5;
`;

export const MintCardBack = () => {
  return (
    <CardWrapper>
      <Card>
        <CardContent>
          <Title>About This Collection</Title>
          <Description>
            This NFT collection represents your stake in the Caribou protocol. 
            Each NFT is unique and provides proof of your participation in the 
            protocol's early stages. Holding this NFT may grant you special 
            privileges and rewards in the future of the Caribou ecosystem.
          </Description>
        </CardContent>
      </Card>
    </CardWrapper>
  );
}; 