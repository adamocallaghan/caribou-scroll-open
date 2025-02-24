import styled from 'styled-components';
import { PortfolioCardFront } from './PortfolioCardFront';

const CardWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
`;

const Card = styled.div`
  width: 100%;
  max-width: 24rem;
  margin: 0 auto;
  background: linear-gradient(135deg, #48466D 0%, #6B6992 50%, #8E8BB0 100%);  // Gradient from dark purple to lighter purple
  border-radius: 0.5rem;  // Rounded corners
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);  // Optional: adds subtle shadow
`;

export const PortfolioCardV2 = () => {
  return (
    <CardWrapper>
      <Card>
        <PortfolioCardFront />
      </Card>
    </CardWrapper>
  );
}; 