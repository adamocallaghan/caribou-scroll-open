import styled from 'styled-components';
import { SwapContractCard } from '../components/contracts/swap/SwapContractCard';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const MainPageContent = styled.div`
  font-size: 4rem;
  text-align: center;
`;

const SwapImage = styled.img`
  width: 200px;
  height: auto;
  margin-top: 1rem;
`;

interface SwapPageProps {
  sendHash?: (hash: string) => void;
  pageIndex?: number;
}

export const SwapPage = () => {
  return (
    <Container>
      <MainContent>
        <MainPageContent>
          Swap
        </MainPageContent>
        <SwapImage src="/swap.svg" alt="Swap" />
      </MainContent>
    </Container>
  );
}; 