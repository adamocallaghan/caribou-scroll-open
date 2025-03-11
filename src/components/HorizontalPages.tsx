import { useEffect, useRef, useState, ReactNode } from 'react';
import styled from 'styled-components';
import { SubPageConfig } from '../types/pages';
import { MintContractCard } from './contracts/mint/MintContractCard';
import { EarnContractCard } from './contracts/earn/EarnContractCard';
import { PredictionContractCard } from './contracts/prediction/PredictionContractCard';
import { SwapContractCardV2 } from './contracts/swap/SwapContractCardV2';
import { PortfolioCardBack } from './contracts/portfolio/PortfolioCardBack';
import { PortfolioCardFront } from './contracts/portfolio/PortfolioCardFront';
import { EarnCardBackV2 } from './contracts/earn/EarnCardBackV2';
import { EarnPositionsCard } from './contracts/portfolio/EarnPositionsCard';
import { MintCardBack } from './contracts/mint/MintCardBack';
import { DigitalCollectiblesCard } from './contracts/portfolio/DigitalCollectiblesCard';
import { TrendingTokens } from './contracts/swap/TrendingTokens';
import { RewardsCard } from './contracts/rewards/RewardsCard';
import { RewardsCardBack } from './contracts/rewards/RewardsCardBack';

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  display: flex;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Page = styled.div<{ bgColor: string; textColor: string }>`
  min-width: 100%;
  height: 100%;
  scroll-snap-align: start;
  background-color: ${props => props.bgColor};
  color: ${props => props.textColor};
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
  position: relative;
  font-size: 1.5rem;
  padding-bottom: calc(env(safe-area-inset-bottom) + 60px);
  margin-top: -30px;
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
`;

const CardBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transform: rotateY(180deg);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FlipButton = styled.button`
  position: absolute;
  bottom: calc(env(safe-area-inset-bottom) + 80px);
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  z-index: 10;

  @media (max-width: 768px) {
    bottom: calc(env(safe-area-inset-bottom) + 100px);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: invert(13%) sepia(0%) saturate(11%) hue-rotate(213deg) brightness(95%) contrast(86%);
  }
`;

const CenteredContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

interface HorizontalPagesProps {
  children: ReactNode;
  subPages: SubPageConfig[];
  bgColor: string;
  textColor: string;
  pageType?: string;
  sendHash?: (hash: string) => void;
  onSubPageChange?: (index: number) => void;
  currentSubPage?: number;
}

export const HorizontalPages = ({
  children,
  subPages,
  bgColor,
  textColor,
  pageType,
  sendHash,
  onSubPageChange,
  currentSubPage = 0
}: HorizontalPagesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(currentSubPage);
  const [flippedPages, setFlippedPages] = useState<{ [key: number]: boolean }>({});
  const [earnCardStates, setEarnCardStates] = useState<{
    [key: number]: {
      contract: any;
      walletUsdcBalance: string;
      usdcBalance: string;
      isDepositing: boolean;
      isWithdrawing: boolean;
      handleDeposit: (amount: string) => Promise<void>;
      handleWithdraw: (amount: string) => Promise<void>;
    }
  }>({});

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const pageWidth = container.clientWidth;
    container.scrollTo({
      left: currentSubPage * pageWidth,
      behavior: 'smooth'
    });
  }, [currentSubPage]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const pageWidth = container.clientWidth;
      const currentScroll = container.scrollLeft;
      const newPage = Math.round(currentScroll / pageWidth);
      
      if (newPage !== currentPage && newPage < subPages.length) {
        setCurrentPage(newPage);
        onSubPageChange?.(newPage);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentPage, onSubPageChange, subPages.length]);

  const handleEarnCardStateChange = (index: number, state: any) => {
    setEarnCardStates(prev => ({
      ...prev,
      [index]: state
    }));
  };

  const renderSubPageContent = (subPage: SubPageConfig, isBack: boolean = false) => {
    if (pageType === 'Mint' && sendHash) {
      if (isBack) {
        return <MintCardBack contractIndex={subPage.index} />;
      }
      return <MintContractCard sendHash={sendHash} contractIndex={subPage.index} />;
    }
    if (pageType === 'Earn' && sendHash) {
      if (isBack) {
        const state = earnCardStates[subPage.index];
        return state ? (
          <EarnCardBackV2 
            poolName={state.contract?.name}
            symbol={state.contract?.asset}
            walletBalance={state.walletUsdcBalance}
            depositedBalance={state.usdcBalance}
            onDeposit={state.handleDeposit}
            onWithdraw={state.handleWithdraw}
            isDepositing={state.isDepositing}
            isWithdrawing={state.isWithdrawing}
          />
        ) : null;
      }
      return (
        <EarnContractCard 
          sendHash={sendHash} 
          contractIndex={subPage.index}
          onStateChange={(state) => handleEarnCardStateChange(subPage.index, state)}
        />
      );
    }
    if (pageType === 'Predict' && sendHash) {
      return <PredictionContractCard sendHash={sendHash} contractIndex={subPage.index} />;
    }
    if (pageType === 'Swap' && sendHash) {
      if (subPage.index === 0) {
        return <SwapContractCardV2 sendHash={sendHash} />;
      } else if (subPage.index === 1) {
        return <TrendingTokens />;
      }
      return <CenteredContent>Swap {subPage.index + 2}</CenteredContent>;
    }
    if (pageType === 'Dashboard') {
      if (subPage.index === 0) {
        return isBack ? <PortfolioCardBack /> : <PortfolioCardFront />;
      } else if (subPage.index === 1) {
        return isBack ? <DigitalCollectiblesCard /> : <EarnPositionsCard />;
      }
    }
    if (pageType === 'Rewards') {
      if (isBack) {
        const protocolName = ['Caribou', 'Scroll Marks', 'Nuri Exchange'][subPage.index];
        return <RewardsCardBack protocolName={protocolName} />;
      }
      return <RewardsCard contractIndex={subPage.index} />;
    }
    return <CenteredContent>{subPage.name}</CenteredContent>;
  };

  const handleFlip = (index: number) => {
    setFlippedPages(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <Container ref={containerRef}>
      {/* First page */}
      <Page bgColor={bgColor} textColor={textColor}>
        {children}
      </Page>
      
      {/* Subsequent pages */}
      {subPages.map((subPage) => (
        <Page
          key={subPage.index}
          bgColor={bgColor}
          textColor={textColor}
        >
          <FlipContainer isFlipped={flippedPages[subPage.index] || false}>
            <CardFront>
              {renderSubPageContent(subPage)}
            </CardFront>
            <CardBack>
              {renderSubPageContent(subPage, true)}
            </CardBack>
          </FlipContainer>
          <FlipButton onClick={() => handleFlip(subPage.index)}>
            <img src="/flip-over.svg" alt="Flip card" />
          </FlipButton>
        </Page>
      ))}
    </Container>
  );
};

export const SwapPages = () => {
  return (
    <HorizontalPages
      subPages={[
        { name: 'Swap 2', index: 0 },
        { name: 'Swap 3', index: 1 },
        { name: 'Swap 4', index: 2 }
      ]}
      bgColor="#4287f5"
      textColor="#FFFFFF"
    >
      <SwapContractCardV2 sendHash={(hash: string) => console.log(hash)} />
      <div>Swap 3</div>
      <div>Swap 4</div>
    </HorizontalPages>
  );
}; 