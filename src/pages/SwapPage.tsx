import styled from 'styled-components';

const Page = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  scroll-snap-align: start;
  background-color: #4287f5;  // New blue background
  color: #FFFFFF;
  font-size: 2rem;
  font-weight: normal;
`;

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
  margin-top: -30px;  // Move content up
  padding-bottom: calc(env(safe-area-inset-bottom) + 60px);  // Add padding to bottom
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

export const SwapPage = () => {
  return (
    <Page>
      <Container>
        <MainContent>
          <MainPageContent>
            Swap
          </MainPageContent>
          <SwapImage src="/swap.svg" alt="Swap" />
        </MainContent>
      </Container>
    </Page>
  );
}; 