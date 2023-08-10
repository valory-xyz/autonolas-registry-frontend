import styled from 'styled-components';
import { Layout } from 'antd/lib';
import { COLOR } from '@autonolas/frontend-library';

export const CustomLayout = styled(Layout)`
  .registry-tabs {
    .ant-tabs-extra-content {
      &:not(:last-child) {
        .ant-typography {
          color: ${COLOR.PRIMARY};
          margin: 0 12px 0 0;
        }
      }
      &:last-child {
        gap: 12px;
        display: flex;
      }
    }
    .ant-tabs-nav-wrap {
      padding-left: 16px;
    }
  }
`;

export const Logo = styled.div`
  width: 110px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: left;
  margin-left: 0.5rem;
  margin-right: 3.5rem;
  span {
    margin-left: 0.5rem;
  }
`;

export const RightMenu = styled.div`
  display: flex;
  align-items: center;
`;

export const FooterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 1rem 50px;
  .socials {
    display: flex;
    column-gap: 28px;
  }
  .footer {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0%);
  }
`;

export const ContractsInfoContainer = styled.div`
  font-size: 16px;
  display: flex;
  align-items: center;
  .registry-contract {
    display: flex;
    align-items: center;
  }
  img {
    margin-right: 8px;
  }
`;
