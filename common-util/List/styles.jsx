import styled from 'styled-components';
import { COLOR } from 'util/theme';
import { Modal } from 'antd/lib';

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
    color: ${COLOR.GREY_2};
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

export const CustomModal = styled(Modal)`
  .ant-typography {
    margin: 0;
  }
`;
