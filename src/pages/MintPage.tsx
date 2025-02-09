import styled from 'styled-components';

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const PageTitle = styled.h1`
  margin: 0;
`;

interface MintPageProps {}

export const MintPage = () => {
  return (
    <PageContent>
      <PageTitle>Mint</PageTitle>
    </PageContent>
  );
}; 