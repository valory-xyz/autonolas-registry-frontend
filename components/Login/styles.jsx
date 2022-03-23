import styled from 'styled-components';
import { COLOR } from 'util/theme';

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

export const MetamaskContainer = styled.div`
  display: flex;
  align-items: center;
  .dash {
    margin: 0 0.75rem;
    width: 1px;
    height: 2.25rem;
    background-color: ${COLOR.PRIMARY};
  }
  .ant-btn {
    margin-left: 0.75rem;
  }
`;
