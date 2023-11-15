import { Result } from 'antd';
import styled from 'styled-components';

const NotLegalContainer = styled.div`
  position: relative;
  top: 100px;
`;

export const PageNotFound = () => (
  <NotLegalContainer>
    <Result
      status="warning"
      title="Page not found!"
    />
  </NotLegalContainer>
);
