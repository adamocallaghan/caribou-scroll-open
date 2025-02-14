import { useEffect, useRef, useState } from 'react';
import { PAGES } from '../types/pages';
import styled from 'styled-components';
import { MintPage } from '../pages/MintPage';
import { EarnPage } from '../pages/EarnPage';
import { DashboardPage } from '../pages/DashboardPage';
import { HorizontalPages } from './HorizontalPages';
import { PredictionPage } from '../pages/PredictionPage';
import { SwapPage } from '../pages/SwapPage';
import { LaunchPage } from '../pages/LaunchPage';
import { SocialPage } from '../pages/SocialPage';

const Container = styled.div`
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Page = styled.div<{ bgColor: string; textColor: string }>`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  scroll-snap-align: start;
  background-color: ${props => props.bgColor};
  color: ${props => props.textColor};
  font-size: 2rem;
  font-weight: bold;
`;

interface PageContainerProps {
  sendHash?: (hash: string) => void;
}

export const PageContainer = ({ sendHash }: PageContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentSubPage, setCurrentSubPage] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const pageHeight = window.innerHeight;
      const currentScroll = container.scrollTop;
      const newPage = Math.round(currentScroll / pageHeight);
      if (newPage !== currentPage) {
        setCurrentPage(newPage);
        setCurrentSubPage(0);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && currentPage < PAGES.length - 1) {
        container.scrollTo({
          top: (currentPage + 1) * window.innerHeight,
          behavior: 'smooth'
        });
      } else if (e.key === 'ArrowUp' && currentPage > 0) {
        container.scrollTo({
          top: (currentPage - 1) * window.innerHeight,
          behavior: 'smooth'
        });
      }
    };

    container.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPage]);

  useEffect(() => {
    console.log('Current main page:', currentPage);
    console.log('Current sub page:', currentSubPage);
  }, [currentPage, currentSubPage]);

  const handleSubPageChange = (index: number) => {
    console.log('SubPage changed to:', index);
    setCurrentSubPage(index);
  };

  const renderPageContent = (pageName: string, pageIndex: number) => {
    switch (pageName) {
      case 'Dashboard':
        return (
          <HorizontalPages
            subPages={PAGES[pageIndex].subPages}
            bgColor={PAGES[pageIndex].color}
            textColor={PAGES[pageIndex].textColor}
          >
            <DashboardPage />
          </HorizontalPages>
        );
      case 'Mint':
        return (
          <HorizontalPages
            subPages={PAGES[pageIndex].subPages}
            bgColor={PAGES[pageIndex].color}
            textColor={PAGES[pageIndex].textColor}
            pageType="Mint"
            sendHash={sendHash}
          >
            <MintPage />
          </HorizontalPages>
        );
      case 'Earn':
        return (
          <HorizontalPages
            subPages={PAGES[pageIndex].subPages}
            bgColor={PAGES[pageIndex].color}
            textColor={PAGES[pageIndex].textColor}
            pageType="Earn"
            sendHash={sendHash}
          >
            <EarnPage />
          </HorizontalPages>
        );
      case 'Predict':
        return (
          <HorizontalPages
            subPages={PAGES[pageIndex].subPages}
            bgColor={PAGES[pageIndex].color}
            textColor={PAGES[pageIndex].textColor}
            pageType="Predict"
            sendHash={sendHash}
            onSubPageChange={handleSubPageChange}
            currentSubPage={currentSubPage}
          >
            <PredictionPage sendHash={sendHash} />
          </HorizontalPages>
        );
      case 'Swap':
        return (
          <HorizontalPages
            subPages={PAGES[pageIndex].subPages}
            bgColor={PAGES[pageIndex].color}
            textColor={PAGES[pageIndex].textColor}
            pageType="Swap"
            sendHash={sendHash}
          >
            <SwapPage />
          </HorizontalPages>
        );
      case 'Launch':
        return (
          <HorizontalPages
            subPages={PAGES[pageIndex].subPages}
            bgColor={PAGES[pageIndex].color}
            textColor={PAGES[pageIndex].textColor}
            pageType="Launch"
            sendHash={sendHash}
          >
            <LaunchPage />
          </HorizontalPages>
        );
      case 'Social':
        return (
          <HorizontalPages
            subPages={PAGES[pageIndex].subPages}
            bgColor={PAGES[pageIndex].color}
            textColor={PAGES[pageIndex].textColor}
            pageType="Social"
            sendHash={sendHash}
          >
            <SocialPage />
          </HorizontalPages>
        );
      default:
        return (
          <HorizontalPages
            subPages={PAGES[pageIndex].subPages}
            bgColor={PAGES[pageIndex].color}
            textColor={PAGES[pageIndex].textColor}
          >
            {pageName}
          </HorizontalPages>
        );
    }
  };

  return (
    <Container ref={containerRef}>
      {PAGES.map((page, index) => (
        <Page
          key={page.name}
          bgColor={page.color}
          textColor={page.textColor}
        >
          {renderPageContent(page.name, index)}
        </Page>
      ))}
    </Container>
  );
}; 