import styled from 'styled-components';
import { Layout } from 'antd';
import { COLOR } from 'util/theme';

export const CustomLayout = styled(Layout)`
  /* layout */
  .site-layout {
    padding: 0 50px;
    margin-top: 64px;
  }
  .site-layout-background {
    padding: 24px 0;
    min-height: calc(100vh - 134px);
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
