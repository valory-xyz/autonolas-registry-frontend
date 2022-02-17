import styled from 'styled-components';
import { Typography } from 'antd';

export const DetailsTitle = styled(Typography.Title)`
  text-transform: capitalize;
  margin: 0 !important;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

export const InfoSubHeader = styled.div`
  font-weight: bold;
`;

export const Info = styled.div`
  word-break: break-word;
  li {
    text-decoration: underline;
  }
`;
