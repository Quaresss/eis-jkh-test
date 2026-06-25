import styled from 'styled-components';
import { MetersPage } from './pages/MetersPage';

const App = () => (
  <AppLayout>
    <ContentWrapper>
      <MetersPage />
    </ContentWrapper>
  </AppLayout>
);

const AppLayout = styled.main`
  min-height: 100vh;
  background: #f8f9fa;
  font-family: Roboto, Arial, sans-serif;
`;

const ContentWrapper = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
`;

export default App;
