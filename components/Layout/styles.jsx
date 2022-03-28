import styled from 'styled-components';
import { Layout } from 'antd';
import { COLOR, OTHERS } from 'util/theme';

const ANTD_COLOR = {
  whiteColor: '#fff',
  borderColor: '#f0f0f0',
};

export const CustomLayout = styled(Layout)`
  /* common */

  /* layout */
  .ant-layout-header {
    display: flex;
    position: fixed;
    z-index: 1;
    width: 100%;
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
        }
      }
      .ant-menu-item-selected {
        font-weight: bold;
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
      border-radius: 18px;
      background-color: transparent;
      border-color: transparent !important;
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
          color: ${COLOR.PRIMARY};
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
      border-left: 1px solid ${COLOR.BORDER_GREY};
    }
    .ant-table-cell:last-child {
      border-right: 1px solid ${COLOR.BORDER_GREY};
    }
  }
  .ant-table-thead {
    > tr > th {
      border-top: 1px solid ${COLOR.BORDER_GREY};
      border-bottom: 2px solid ${COLOR.BORDER_GREY};
      font-weight: normal;
      padding: 12px 16px;
      &:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
        background-color: transparent;
      }
    }
  }
  .ant-table-tbody > tr {
    > td {
      padding: 12px 16px;
      background: ${COLOR.TABLE_BLACK};
      &.underline span {
        text-decoration: underline;
      }
      .ant-btn {
        &:first-child {
          padding-left: 0;
        }
      }
    }
    &:last-child {
      td {
        &:first-child {
          border-bottom-left-radius: ${OTHERS.borderRadius};
        }
        &:last-child {
          border-bottom-right-radius: ${OTHERS.borderRadius};
        }
      }
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
  align-items: center;
  padding: 1rem 50px;
  .socials {
    display: flex;
    column-gap: 28px;
  }
`;

export const SupportOnlyDesktop = styled.div`
  margin: 4rem 0;
`;
