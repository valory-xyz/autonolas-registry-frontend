import styled from 'styled-components';
import { Typography, Image } from 'antd';
import { COLOR } from 'util/theme';

export const DetailsTitle = styled(Typography.Title)`
  text-transform: capitalize;
  margin: 0 !important;
`;

export const SubTitle = styled(Typography.Text)`
  margin-top: 0.5rem;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .right-content {
    .ant-btn {
      margin-left: 1rem;
    }
  }
`;

export const InfoSubHeader = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: ${COLOR.BLACK};
  .ant-btn {
    font-size: 18px;
  }
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
  padding-top: 1.25rem;
`;

export const NftImageContainer = styled(Image)`
  border: 1px solid ${COLOR.BORDER_GREY};
`;

export const ServiceStatus = styled.div`
  display: inline-block;
  &.active svg {
    fill: ${COLOR.GREEN};
    color: ${COLOR.GREEN};
  }
  &.inactive svg {
    fill: ${COLOR.RED_1};
    color: ${COLOR.RED_1};
  }
  svg {
    top: -1px;
    margin-right: 6px;
    position: relative;
  }
`;

export const SectionContainer = styled.div`
  margin-right: 1rem;
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
  .ant-form-item-label > label {
    left: -4px;
  }
`;
