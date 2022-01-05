import { createGlobalStyle } from 'styled-components';
import { COLOR } from 'util/theme';

// const GlobalStyles = styled.div`
const GlobalStyle = createGlobalStyle`
  *,
  :after,
  :before {
    box-sizing: border-box;
  }

  body,
  html {
    width: 100%;
    height: 100%;
    background: ${COLOR.WHITE};
    overscroll-behavior: none;
    margin: 0;
    font-family: texgyreheros__regular, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  body {
    /* uncomment for dark mode */
    /* filter: invert(1) hue-rotate(180deg); */
  }
`;

export default GlobalStyle;
