import styled, { createGlobalStyle } from 'styled-components';
import { COLOR } from 'util/theme';

export const GlobalStyle = createGlobalStyle`
  html {
    scroll-behavior: smooth;
  }
  .mb-16 {
    margin-bottom: 16px;
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

export const FormContainer = styled.div`
  max-width: 520px;
  textarea {
    resize: none;
  }
  .ant-typography {
    color: ${COLOR.PRIMARY};
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
