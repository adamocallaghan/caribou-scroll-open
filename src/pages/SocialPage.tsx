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

const SocialImage = styled.img`
  width: 200px;
  height: auto;
  margin-top: 1rem;
`;

export const SocialPage = () => {
  return (
    <Container>
      <MainContent>
        <MainPageContent>
          Social
        </MainPageContent>
        <SocialImage src="/social.svg" alt="Social" />
      </MainContent>
    </Container>
  );
}; 