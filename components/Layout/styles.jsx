import styled from 'styled-components';
import { Layout } from 'antd';
import { COLOR } from 'util/theme';

const ANTD_COLOR = {
  whiteColor: '#fff',
  borderColor: '#f0f0f0',
};

export const CustomLayout = styled(Layout)`
  background: ${ANTD_COLOR.whiteColor} !important;
  /* common */

  /* layout */
  .ant-layout-header {
    display: flex;
    position: fixed;
    z-index: 1;
    width: 100%;
    background: ${ANTD_COLOR.whiteColor};
    .ant-menu {
      flex: 1;
      &.ant-menu-horizontal {
        border: none;
      }
      &.ant-menu-horizontal > .ant-menu-item::after,
      .ant-menu-horizontal > .ant-menu-submenu::after {
        border-bottom: none !important;
      }
      .ant-menu-item {
        &:hover {
          color: ${COLOR.BLACK};
        }
      }
      .ant-menu-item-selected {
        font-weight: bold;
        color: ${COLOR.BLACK};
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
      background-color: transparent;
      border-color: transparent;
    }
    > .ant-tabs-nav .ant-tabs-tab-active {
      border-bottom-color: ${ANTD_COLOR.borderColor};
      background-color: ${COLOR.GREY_1};
      .ant-tabs-tab-btn {
        color: ${COLOR.BLACK};
      }
    }
  }

  .ant-tabs-top > .ant-tabs-nav::before,
  .ant-tabs-bottom > .ant-tabs-nav::before,
  .ant-tabs-top > div > .ant-tabs-nav::before,
  .ant-tabs-bottom > div > .ant-tabs-nav::before {
    border-bottom: none;
  }

  .registry-tabs {
    .ant-tabs-extra-content {
      &:not(:last-child) {
        .ant-typography {
          margin: 0 12px 0 0;
        }
      }
      &:last-child {
        .ant-input-affix-wrapper {
          width: 200px;
          margin-right: 12px;
        }
      }
    }
    .ant-tabs-nav-wrap {
      padding-left: 16px;
    }
  }

  /* table */
  .ant-table {
    .ant-table-cell:first-child {
      border-left: 1px solid ${ANTD_COLOR.borderColor};
    }
    .ant-table-cell:last-child {
      border-right: 1px solid ${ANTD_COLOR.borderColor};
    }
  }
  .ant-table-thead {
    > tr > th {
      border-top: 1px solid ${ANTD_COLOR.borderColor};
      border-bottom: 2px solid ${ANTD_COLOR.borderColor};
      background-color: ${COLOR.WHITE};
      font-weight: normal;
      padding: 12px 16px;

      &:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
        background-color: transparent;
      }
    }
  }
  .ant-table-tbody > tr > td {
    padding: 12px 16px;
    &.underline span {
      text-decoration: underline;
    }

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
  display: flex;
  align-items: center;
  justify-content: left;
  margin-right: 1.5rem;
  .title-logo {
    width: 32px;
    height: 32px;
    margin-right: 8px;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url("/images/autonolas-logo.png");
  }
`;

export const RightMenu = styled.div`
  display: flex;
  align-items: center;
`;
