import styled from 'styled-components';
import { useState } from 'react';
import { PortfolioCardFront } from './PortfolioCardFront';
import { PortfolioCardBack } from './PortfolioCardBack';

const Card = styled.div`
  width: 100%;
  max-width: 24rem;
  margin: 0 auto;
  background: linear-gradient(135deg, #f3c86c 0%, #ffecd1 50%, #fff6e5 100%);
  border-radius: 0.5rem;
  overflow: hidden;
  perspective: 1000px;
  min-height: 400px;
`;

const FlipContainer = styled.div<{ isFlipped: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  transform: ${props => props.isFlipped ? 'rotateY(180deg)' : 'rotateY(0)'};
`;

const CardFront = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: inherit;
`;

const CardBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transform: rotateY(180deg);
  background: inherit;
`;

const FlipButton = styled.button`
  position: fixed;
  bottom: max(20px, env(safe-area-inset-bottom));
  right: max(20px, env(safe-area-inset-right));
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  z-index: 10;
  
  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
    bottom: calc(env(safe-area-inset-bottom) + 60px);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: invert(13%) sepia(0%) saturate(11%) hue-rotate(213deg) brightness(95%) contrast(86%);
  }
`;

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
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <CardWrapper>
      <Card>
        <FlipContainer isFlipped={isFlipped}>
          <CardFront>
            <PortfolioCardFront />
          </CardFront>

          <CardBack>
            <PortfolioCardBack />
          </CardBack>
        </FlipContainer>
        <FlipButton onClick={() => setIsFlipped(!isFlipped)}>
          <img src="/flip-over.svg" alt="Flip card" />
        </FlipButton>
      </Card>
    </CardWrapper>
  );
}; 