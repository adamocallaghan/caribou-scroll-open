import styled from 'styled-components';

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

const LaunchImage = styled.img`
  width: 200px;
  height: auto;
  margin-top: 1rem;
`;

export const LaunchPage = () => {
  return (
    <Container>
      <MainContent>
        <MainPageContent>
          Launch
        </MainPageContent>
        <LaunchImage src="/launch.svg" alt="Launch" />
      </MainContent>
    </Container>
  );
}; 