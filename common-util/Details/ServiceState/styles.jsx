import styled from 'styled-components';

export const ServiceStateContainer = styled.div`
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
  .ant-table,
  .ant-input {
    font-size: 16px;
  }
  .step-2-active-registration {
    .ant-table-wrapper {
      margin-bottom: 1rem;
    }
  }
  .step-3-finished-registration {
    .ant-form,
    .terminate-btn {
      margin-top: 1rem;
    }
  }
  .step-4-terminate {
    > div {
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

  [data-theme="dark"] .editable-row:hover .editable-cell-value-wrap {
    border: 1px solid #434343;
  }
`;
