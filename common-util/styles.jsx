import styled from 'styled-components';

export const Address = styled.div`
  width: ${({ width }) => `${width || 120}px`};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
