import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { SubPageConfig } from '../types/pages';
import { MintContractCard } from './contracts/mint/MintContractCard';
import { EarnContractCard } from './contracts/earn/EarnContractCard';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  overflow-x: scroll;
  overflow-y: hidden;
  display: flex;
  scroll-snap-type: x mandatory;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const SubPage = styled.div<{ bgColor: string; textColor: string }>`
  min-width: 100vw;
  height: 100vh;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.bgColor};
  color: ${props => props.textColor};
`;

interface HorizontalPagesProps {
  subPages: SubPageConfig[];
  bgColor: string;
  textColor: string;
  children?: React.ReactNode;
  pageType?: string;
  sendHash?: (hash: string) => void;
}

export const HorizontalPages = ({
  subPages,
  bgColor,
  textColor,
  children,
  pageType,
  sendHash
}: HorizontalPagesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSubPage, setCurrentSubPage] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentSubPage < subPages.length) {
        container.scrollTo({
          left: (currentSubPage + 1) * window.innerWidth,
          behavior: 'smooth'
        });
      } else if (e.key === 'ArrowLeft' && currentSubPage > 0) {
        container.scrollTo({
          left: (currentSubPage - 1) * window.innerWidth,
          behavior: 'smooth'
        });
      }
    };

    const handleScroll = () => {
      const pageWidth = window.innerWidth;
      const currentScroll = container.scrollLeft;
      const newPage = Math.round(currentScroll / pageWidth);
      setCurrentSubPage(newPage);
    };

    container.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSubPage, subPages.length]);

  const renderSubPageContent = (subPage: SubPageConfig) => {
    if (pageType === 'Mint' && sendHash) {
      return <MintContractCard sendHash={sendHash} contractIndex={subPage.index} />;
    }
    if (pageType === 'Earn' && sendHash) {
      return <EarnContractCard sendHash={sendHash} contractIndex={subPage.index} />;
    }
    return subPage.name;
  };

  return (
    <Container ref={containerRef}>
      <SubPage bgColor={bgColor} textColor={textColor}>
        {children}
      </SubPage>
      {subPages.map((subPage) => (
        <SubPage
          key={subPage.index}
          bgColor={bgColor}
          textColor={textColor}
        >
          {renderSubPageContent(subPage)}
        </SubPage>
      ))}
    </Container>
  );
}; 