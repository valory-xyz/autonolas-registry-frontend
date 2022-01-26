import styled from 'styled-components';
import { Layout } from 'antd';

const ANTD_COLOR = {
  whiteColor: '#fff',
  borderColor: '#f0f0f0',
};

export const CustomLayout = styled(Layout)`
  background: ${ANTD_COLOR.whiteColor} !important;
  .ant-layout-header {
    display: flex;
    position: fixed;
    z-index: 1;
    width: 100%;
    background: ${ANTD_COLOR.whiteColor};
    border-bottom: 1px solid ${ANTD_COLOR.borderColor};
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

  /* tabs */
  .ant-tabs-card.ant-tabs-top {
    > .ant-tabs-nav .ant-tabs-tab {
      border-radius: 8px;
    }
    > .ant-tabs-nav .ant-tabs-tab-active {
      border-bottom-color: ${ANTD_COLOR.borderColor};
    }
  }

  .ant-tabs-top > .ant-tabs-nav::before,
  .ant-tabs-bottom > .ant-tabs-nav::before,
  .ant-tabs-top > div > .ant-tabs-nav::before,
  .ant-tabs-bottom > div > .ant-tabs-nav::before {
    border-bottom: none;
  }

  .registry-tabs .ant-tabs-extra-content {
    &:not(:last-child) {
      .ant-typography {
        margin: 0 12px 0 0;
      }
    }
    &:last-child {
      .ant-input-search {
        width: 200px;
        margin-right: 12px;
      }
    }
  }

  /* table */
  .ant-table-thead > tr > th {
    border-top: 1px solid ${ANTD_COLOR.borderColor};
    padding: 12px 16px;
    &:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
      background-color: transparent;
    }
  }
  .ant-table-tbody > tr > td {
    .ant-btn {
      span {
        text-decoration: underline;
      }
      &:first-child {
        padding-left: 0;
      }
    }
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
