import { Result } from 'antd';
import styled from 'styled-components';

const NotLegalContainer = styled.div`
  position: relative;
  top: 100px;
`;

export const NotLegal = () => (
  <NotLegalContainer>
    <Result
      status="warning"
      title="Your country is not allowed to access this website due to legal reasons!"
    />
  </NotLegalContainer>
);
