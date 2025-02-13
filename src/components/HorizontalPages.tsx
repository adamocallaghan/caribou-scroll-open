import { useEffect, useRef, useState, ReactNode } from 'react';
import styled from 'styled-components';
import { SubPageConfig } from '../types/pages';
import { MintContractCard } from './contracts/mint/MintContractCard';
import { EarnContractCard } from './contracts/earn/EarnContractCard';

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
      {/* First page */}
      <Page bgColor={bgColor} textColor={textColor}>
        {children}
      </Page>
      
      {/* Subsequent pages */}
      {pageType === 'Predict' ? (
        // For Predict pages, render the PredictionPage with different indices
        subPages.map((subPage) => (
          <Page
            key={subPage.index}
            bgColor={bgColor}
            textColor={textColor}
          >
            {children} {/* This will be PredictionPage with the correct pageIndex */}
          </Page>
        ))
      ) : (
        // For other pages, render normally
        subPages.map((subPage) => (
          <Page
            key={subPage.index}
            bgColor={bgColor}
            textColor={textColor}
          >
            {renderSubPageContent(subPage)}
          </Page>
        ))
      )}
    </Container>
  );
}; 