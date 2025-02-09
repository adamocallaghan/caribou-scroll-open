import styled from 'styled-components';

const PageContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const LogoContainer = styled.div`
  position: absolute;
  top: 80px; // Adjust this value to position below wallet button
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
`;

const Logo = styled.img`
  max-width: 300px;
  height: auto;
`;

interface DashboardPageProps {}

export const DashboardPage = () => {
  return (
    <PageContent>
      <LogoContainer>
        <Logo src="caribou_logo_name.jpg" alt="Caribou Logo" />
      </LogoContainer>
    </PageContent>
  );
}; 