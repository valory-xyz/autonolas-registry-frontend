import { MEDIA_QUERY, COLOR } from '@autonolas/frontend-library';
import { createGlobalStyle } from 'styled-components';

const ANTD_COLOR = {
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
    margin: 0;
    font-family: texgyreheros__regular, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  html {
    /* uncomment for dark mode */
    /* background-color: ${COLOR.WHITE}; */
    /* filter: invert(0.85) hue-rotate(180deg); */
  }

  /* common */
  .m-0 {
    margin: 0 !important;
  }
  .mb-0 {
    margin-bottom: 0px;
  }
  .mb-8 {
    margin-bottom: 8px;
  }
  .mb-12 {
    margin-bottom: 12px;
  }
  .mb-16 {
    margin-bottom: 16px;
  }
  .mt-0 {
    margin-top: 0px;
  }
  .mt-8 {
    margin-top: 8px;
  }
  .mt-16 {
    margin-top: 16px;
  }
  .mr-16 {
    margin-right: 16px;
  }
  .pl-0 {
    padding-left: 0px !important;
  }

  /* layout */
  .ant-layout-header {
    display: flex;
    position: fixed;
    z-index: 10;
    width: 100%;
    height: 64px;
    line-height: 64px;
    padding: 0 50px;
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
    .ant-table-thead {
      > tr > th {
        padding: 12px 16px;
        &:not(:last-child):not(.ant-table-selection-column):not(
            .ant-table-row-expand-icon-cell
          ):not([colspan])::before {
          background-color: transparent;
        }
      }
    }
    .ant-table-tbody > tr {
      > td {
        padding: 8px 16px;
        .ant-btn {
          &:first-child {
            padding-left: 0;
          }
        }
      }
      &:last-child {
        td {
          &:first-child {
            border-bottom-left-radius: 5px;
          }
          &:last-child {
            border-bottom-right-radius: 5px;
          }
        }
      }
    }
  }

  .ant-table:not(.ant-table-bordered) {
    .ant-table-cell:first-child {
      border-left: 1px solid ${COLOR.BORDER_GREY};
    }
    .ant-table-cell:last-child {
      border-right: 1px solid ${COLOR.BORDER_GREY};
    }
    .ant-table-thead {
      > tr > th {
        border-top: 1px solid ${COLOR.BORDER_GREY};
        border-bottom: 1px solid ${COLOR.BORDER_GREY};
      }
    }
  }

  .ant-tooltip-inner {
    text-align: center;
  }

  /* alert */
  .inherit-alert-info {
    background-color: inherit;
    border-color: ${COLOR.PRIMARY};
  }

  /* ant image */
  .ant-image-preview-wrap {
    background: ${COLOR.GREY_2};
  }

  /* ant notification */
  .ant-notification-notice-message {
    margin-bottom: 0 !important;
  }

  .next-error-h1 {
    color: ${COLOR.BLACK}; 
    border-color: ${COLOR.BLACK} !important;
    + div {
      color: ${COLOR.BLACK};
    } 
  }

  ${MEDIA_QUERY.mobileL} {
    .ant-table {
      .ant-table-thead {
        > tr > th {
          padding: 6px 16px;
        }
      }
      .ant-table-tbody > tr {
        > td {
          padding: 6px 16px;
        }
      }
    }
  }

  ${MEDIA_QUERY.mobileM} {
    .ant-layout-header {
      padding: 0;
    }
  }
`;

export default GlobalStyle;
