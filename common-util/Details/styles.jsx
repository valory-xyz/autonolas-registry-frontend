import styled from 'styled-components';
import { Typography } from 'antd';
import { COLOR } from 'util/theme';

export const DetailsTitle = styled(Typography.Title)`
  text-transform: capitalize;
  margin: 0 !important;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  .right-content {
    .ant-btn {
      margin-left: 1rem;
    }
  }
`;

export const InfoSubHeader = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: ${COLOR.GREY_2};
`;

export const Info = styled.div`
  word-break: break-all;
  li {
    .ant-btn-link {
      padding: 0;
      height: auto;
    }
  }
`;

export const EachSection = styled.div`
  padding: 1rem 2rem;
  border: 1px solid ${COLOR.BORDER_GREY};
  border-bottom-color: transparent;
`;

export const SectionContainer = styled.div`
  ${EachSection} {
    &:first-child {
      border-top-left-radius: 1rem;
      border-top-right-radius: 1rem;
    }
    &:last-child {
      border-bottom-left-radius: 1rem;
      border-bottom-right-radius: 1rem;
      border-bottom-color: ${COLOR.BORDER_GREY};
    }
  }
`;
