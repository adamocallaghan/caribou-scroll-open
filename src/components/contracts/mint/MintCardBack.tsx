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
  background: linear-gradient(135deg, #FF69B4 0%, #FFC0CB 50%, #FFFFFF 100%);
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