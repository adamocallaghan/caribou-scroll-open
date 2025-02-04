import { useEffect, useRef, useState } from 'react';
import { PAGES } from '../types/pages';
import styled from 'styled-components';
import { MintPage } from '../pages/MintPage';
import { LendPage } from '../pages/LendPage';
import { HorizontalPages } from './HorizontalPages';

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
  sendHash: (hash: string) => void;
}

export const PageContainer = ({ sendHash }: PageContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const pageHeight = window.innerHeight;
      const currentScroll = container.scrollTop;
      const newPage = Math.round(currentScroll / pageHeight);
      setCurrentPage(newPage);
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

  const renderPageContent = (pageName: string, pageIndex: number) => {
    switch (pageName) {
      case 'Mint':
        return (
          <HorizontalPages
            subPages={PAGES[pageIndex].subPages}
            bgColor={PAGES[pageIndex].color}
            textColor={PAGES[pageIndex].textColor}
            pageIndex={pageIndex}
          >
            <MintPage sendHash={sendHash} />
          </HorizontalPages>
        );
      case 'Lend':
        return (
          <HorizontalPages
            subPages={PAGES[pageIndex].subPages}
            bgColor={PAGES[pageIndex].color}
            textColor={PAGES[pageIndex].textColor}
            pageIndex={pageIndex}
          >
            <LendPage sendHash={sendHash} />
          </HorizontalPages>
        );
      default:
        return (
          <HorizontalPages
            subPages={PAGES[pageIndex].subPages}
            bgColor={PAGES[pageIndex].color}
            textColor={PAGES[pageIndex].textColor}
            pageIndex={pageIndex}
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