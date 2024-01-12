import styled, { css } from 'styled-components';
import { Layout } from 'antd';
import { COLOR, MEDIA_QUERY } from '@autonolas/frontend-library';

const scrollBarStyle = css`
  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
`;

export const CustomLayout = styled(Layout)`
  .site-layout {
    padding: 0 50px;
    margin-top: 64px;
  }
  .site-layout-background {
    padding: 24px 0;
    min-height: calc(100vh - 140px);
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
        gap: 12px;
        display: flex;
      }
    }
    .ant-tabs-nav-wrap {
      padding-left: 16px;
    }
  }

  ${MEDIA_QUERY.tabletL} {
    .site-layout {
      padding: 0 24px;
    }
    .site-layout-background {
      padding: 0;
    }
    .registry-tabs {
      .ant-tabs-nav {
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        .ant-tabs-extra-content {
          margin-top: 12px;
        }
      }
      .ant-tabs-nav-wrap {
        padding-left: 0;
      }
      .ant-tabs-nav-list {
        transform: none !important;
      }
    }
    /* footer from autonolas-library */
    main + div {
      padding: 24px;
    }
  }

  ${MEDIA_QUERY.mobileL} {
    .site-layout {
      padding: 0 16px;
    }
    /* footer from autonolas-library */
    main + div {
      flex-direction: column;
      align-items: center;
      gap: 20px;
      .footer-center {
        position: relative;
        left: 0;
        transform: none;
      }
    }
  }
`;

export const Logo = styled.div`
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: left;
  margin-right: ${(props) => (props.ismobile === 'true' ? '10px' : '20px')};
  > span {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }

  ${MEDIA_QUERY.mobileL} {
    margin-right: 0.5rem;
  }
`;

export const SelectContainer = styled.div`
  ${scrollBarStyle}
`;

export const RightMenu = styled.div`
  display: flex;
  align-items: center;
`;

export const ContractsInfoContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  .registry-contract {
    display: flex;
    align-items: center;
  }
  img {
    margin-right: 8px;
  }

  ${MEDIA_QUERY.laptop} {
    flex-direction: column;
    align-items: flex-start;
  }
  ${MEDIA_QUERY.mobileL} {
    align-items: center;
  }
`;

export const OlasHeader = styled(Layout.Header)`
  padding: 0 ${(props) => (props.ismobile === 'true' ? '10px' : '20px')} !important;
  border-bottom: 1px solid ${COLOR.BORDER_GREY} !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
`;
