import styled from 'styled-components';

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px; // Space for wallet button
  gap: 20px;
`;

const Logo = styled.img`
  max-width: 300px;
  height: auto;
`;

interface DashboardPageProps {
  sendHash: (hash: string) => void;
}

export const DashboardPage = ({ sendHash }: DashboardPageProps) => {
  return (
    <PageContent>
      <Logo src="caribou_logo_name.jpg" alt="Caribou Logo" />
    </PageContent>
  );
}; 