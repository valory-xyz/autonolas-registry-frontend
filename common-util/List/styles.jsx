import styled from 'styled-components';
import { COLOR } from 'util/theme';

export const RegisterFooter = styled.div`
  display: flex;
  align-items: center;
  p {
    margin: 0;
    margin-right: 24px;
  }
`;

export const ComplexLabel = styled.div`
  display: flex;
  flex-direction: column;
  .label-helper-text {
    color: ${COLOR.GREY_TEXT};
    a {
      display: inline-flex;
      align-items: center;
      text-decoration: underline;
      text-underline-position: under;
      svg {
        margin-left: 2px;
      }
    }
  }
`;
