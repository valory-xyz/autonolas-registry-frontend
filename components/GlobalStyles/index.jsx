import { createGlobalStyle } from 'styled-components';
import { COLOR, OTHERS } from 'util/theme';

const ANTD_COLOR = {
  whiteColor: '#fff',
  borderColor: '#f0f0f0',
};

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

  /* common */
  .mb-12 {
    margin-bottom: 12px;
  }
  .mb-0 {
    margin-bottom: 0px;
  }
  .pl-0 {
    padding-left: 0px !important;
  }

  /* layout */
  .ant-layout {
    background: ${COLOR.WHITE}
  }
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
      .ant-menu-item-selected {
        font-weight: bold;
      }
    }
  }

  .ant-layout-footer {
    text-align: center;
  }

  /* layout */
  .site-layout {
    padding: 0 50px;
    margin-top: 64px;
  }
  .site-layout-background {
    padding: 24px 0;
    min-height: calc(100vh - 134px);
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

  /* table */
  .ant-table {
    .ant-table-cell:first-child {
      border-left: 1px solid ${COLOR.BORDER_GREY};
    }
    .ant-table-cell:last-child {
      border-right: 1px solid ${COLOR.BORDER_GREY};
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
  }

  /* alert */
  .inherit-alert-info {
    background-color: inherit;
    border-color: ${COLOR.PRIMARY};
  }
`;

export default GlobalStyle;
