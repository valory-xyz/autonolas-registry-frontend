import styled from 'styled-components';
import { COLOR, MEDIA_QUERY } from 'util/theme';

export const Container = styled.div``;

export const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  .ant-typography {
    margin: 0;
    max-width: 180px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

export const WalletContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  line-height: normal;
  .unsupported-network {
    display: flex;
    align-items: center;
    margin-right: 1rem;
    color: ${COLOR.RED};
    svg {
      margin-right: 0.5rem;
    }
  }
  .dash {
    margin: 0 0.75rem;
    width: 1px;
    height: 2.25rem;
    background-color: ${COLOR.PRIMARY};
  }
  .address {
    width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ant-btn {
    margin-left: 0.75rem;
  }

  ${MEDIA_QUERY.tabletL} {
    > div {
      line-height: 1.5;
    }
  }

  ${MEDIA_QUERY.tablet} {
    .ant-btn {
      padding: 0.1rem 0.5rem !important;
    }
    .address {
      width: 110px;
    }
  }

  ${MEDIA_QUERY.mobileM} {
    .address {
      width: 40px;
    }
  }
`;
