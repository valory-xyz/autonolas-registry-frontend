import styled from 'styled-components';
import { Typography } from 'antd/lib';

const { Text } = Typography;

export const ServiceStateContainer = styled.div`
  margin-top: 1rem;
  .ant-btn {
    font-size: 16px;
    height: 32px;
    padding: 0 1rem;
  }
  .ant-steps-item-description {
    .ant-divider {
      margin: 0.75rem 0;
    }
  }

  .step-2-active-registration {
    .ant-table-wrapper {
    }
    .ant-typography {
      display: block;
      font-size: 14px;
      margin-bottom: 1rem;
    }
    .ant-table,
    .ant-input {
      font-size: 16px;
    }
  }
  .step-3-finished-registration {
    .ant-form,
    .terminate-btn {
      margin-top: 0.75rem;
    }
  }
  .step-4-terminate {
    > div {
      font-size: 16px;
    }
    .ant-table {
      font-size: 16px;
    }
  }

  /* table */
  .editable-cell {
    position: relative;
  }

  .editable-cell-value-wrap {
    padding: 5px 12px;
    cursor: pointer;
  }

  .editable-row:hover .editable-cell-value-wrap {
    padding: 4px 11px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
  }

  .ant-form-item-explain.ant-form-item-explain-error {
    font-size: 16px;
  }

  [data-theme='dark'] .editable-row:hover .editable-cell-value-wrap {
    border: 1px solid #434343;
  }
`;

export const RadioLabel = styled(Text)`
  display: block;
  margin-bottom: 4px;
  padding: 4px 8px;
  font-size: 16px;
  line-height: normal;
  border: 1px solid;
  background: rgba(150, 150, 150, 0.1);
  border: 1px solid rgba(100, 100, 100, 0.2);
  border-radius: 4px;
`;
