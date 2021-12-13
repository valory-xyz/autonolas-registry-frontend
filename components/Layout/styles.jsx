import styled from 'styled-components';
import { Layout } from 'antd';

export const CustomLayout = styled(Layout)`
  background: #fff !important;
  .ant-layout-header {
    display: flex;
    position: fixed;
    z-index: 1;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #f0f0f0;
    .ant-menu {
      flex: 1;
      &.ant-menu-horizontal {
        border: none;
      }
    }
  }
  .site-layout {
    padding: 0 50px;
    margin-top: 64px;
  }
  .site-layout-background {
    padding: 24px 0;
    min-height: calc(100vh - 134px);
  }
  .ant-layout-footer {
    text-align: center;
  }
`;

export const Logo = styled.div`
  width: 96px;
  font-weight: bold;
  cursor: pointer;
`;

export const RightMenu = styled.div`
  display: flex;
  align-items: center;
`;
