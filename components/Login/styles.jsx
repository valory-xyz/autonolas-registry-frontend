import styled from 'styled-components';

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
