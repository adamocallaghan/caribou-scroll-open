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

interface MintPageProps {
  sendHash: (hash: string) => void;
}

export const MintPage = ({ sendHash }: MintPageProps) => {
  return (
    <PageContent>
      <PageTitle>Mint</PageTitle>
    </PageContent>
  );
}; 