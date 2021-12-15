import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html {
    scroll-behavior: smooth;
  }
`;

export const Container = styled.div``;

export const EmptyMessage = styled.div`
  min-height: 200px;
  width: ${({ width }) => width || 'auto'};
  display: flex;
  align-items: center;
  margin: 0 auto;
  text-align: center;
  flex-direction: column;
  justify-content: center;
  p {
    margin: 0;
  }
  .ant-btn-link {
    padding: 0;
  }
`;

export const RegisterFooter = styled.div`
  display: flex;
  align-items: center;
  p {
    margin: 0;
    margin-right: 24px;
  }
`;
