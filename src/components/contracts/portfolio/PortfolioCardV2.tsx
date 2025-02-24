import styled from 'styled-components';
import { PortfolioCardFront } from './PortfolioCardFront';

const CardWrapper = styled.div`
  width: 100%;
  height: 100dvh;
  max-height: calc(100dvh - env(safe-area-inset-bottom));
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  padding-top: 60px;
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding-bottom: calc(120px + env(safe-area-inset-bottom));
  }
`;

export const PortfolioCardV2 = () => {
  return (
    <CardWrapper>
      <PortfolioCardFront />
    </CardWrapper>
  );
}; 