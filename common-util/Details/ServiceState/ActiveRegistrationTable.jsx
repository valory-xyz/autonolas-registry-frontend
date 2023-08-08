/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Form, Input, Table, Button,
} from 'antd/lib';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import get from 'lodash/get';
import { URL } from 'util/constants';
import { isL1Network, isValidAddress } from 'common-util/functions';

const TableContainer = styled.div`
  .ant-form-item-explain-error {
    font-size: 15px;
  }

  /* show only 1 error if there are multiple */
  .ant-form-item-explain-error:not(:first-child) {
    display: none;
  }
`;

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

/**
 * Agent Instance Addresses (editable column)
 */
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  isDisabled,
  setIsValidAgentAddress,
  hasAtleastOneAgentInstanceAddress,
  ...restProps
}) => {
  const form = useContext(EditableContext);
  const inputRef = useRef(null);

  useEffect(() => {
    if (record) {
      form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    } else {
      form.setFieldsValue({ [dataIndex]: null });
    }
  }, [record]);

  let childNode = children;
  const slots = get(record, 'availableSlots') || 0;

  // if there are no slots, the input should be disabled
  const isInputDisabled = isDisabled || !slots;

  const onSave = async () => {
    try {
      const values = await form.validateFields();
      handleSave({ ...record, ...values });
    } catch (info) {
      setIsValidAgentAddress(false);
      window.console.log('Save failed:', info);
    }
  };

  if (editable) {
    childNode = slots > 0 ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: !hasAtleastOneAgentInstanceAddress,
            message: `${title} is required.`,
          },
          () => ({
            validator(_, value) {
              // even if one agent instance address is present,
              // resolve if the value is empty
              if (hasAtleastOneAgentInstanceAddress && !value) {
                return Promise.resolve();
              }

              // array of addresses. Eg. ['0x123', '0x456']
              const addressList = value?.split(',').map((v) => v.trim());

              // check if all addresses are valid
              const areAllAddressesValid = addressList?.every((address) => isValidAddress(address));

              // check if there are any duplicate addresses
              const uniqueAddresses = [...new Set(addressList)];
              if (uniqueAddresses.length !== addressList.length) {
                return Promise.reject(
                  new Error('Please enter unique addresses.'),
                );
              }

              return areAllAddressesValid
                ? Promise.resolve()
                : Promise.reject(new Error('Please enter valid addresses.'));
            },
          }),
        ]}
      >
        <Input.TextArea
          disabled={isInputDisabled}
          ref={inputRef}
          onChange={onSave}
          placeholder={[...new Array(slots)]
            .map((_i, index) => `Address ${index + 1}`)
            .join(', ')}
        />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24, minHeight: 64 }}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

/**
 * Step 2 Table
 */
const ActiveRegistrationTable = ({
  data,
  setDataSource,
  isDisabled,
  setIsValidAgentAddress,
}) => {
  const chainId = useSelector((state) => state?.setup?.chainId);

  const router = useRouter();
  const STEP_2_TABLE_COLUMNS = [
    {
      title: 'Agent ID',
      dataIndex: 'agentId',
      key: 'agentId',
      width: 60,
      render: (text) => (
        <Button
          type="link"
          disabled={!isL1Network(chainId)}
          onClick={() => router.push(`${URL.AGENTS}/${text}`)}
        >
          {text}
        </Button>
      ),
    },
    {
      title: 'Available Slots',
      dataIndex: 'availableSlots',
      key: 'availableSlots',
      width: 100,
    },
    {
      title: 'Total Slots',
      dataIndex: 'totalSlots',
      key: 'totalSlots',
      width: 80,
    },
    {
      title: 'Agent Instance Addresses',
      dataIndex: 'agentAddresses',
      key: 'agentAddresses',
      width: '40%',
      editable: true,
    },
  ];

  const handleSave = (row) => {
    const newData = [...data];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
  };

  const components = {
    body: { row: EditableRow, cell: EditableCell },
  };

  const columns = STEP_2_TABLE_COLUMNS.map((c) => {
    if (!c.editable) {
      return c;
    }

    // event if one of the agent instance addresses is present,
    // it is okay to NOT have other agent instance addresses
    const hasAtleastOneAgentInstanceAddress = data?.some(
      (agentInstance) => !!agentInstance?.agentAddresses,
    );

    useEffect(() => {
      setIsValidAgentAddress(hasAtleastOneAgentInstanceAddress);
    }, [hasAtleastOneAgentInstanceAddress]);

    return {
      ...c,
      onCell: (record) => ({
        record,
        editable: c.editable,
        dataIndex: c.dataIndex,
        title: c.title,
        isDisabled,
        handleSave,
        setIsValidAgentAddress,
        hasAtleastOneAgentInstanceAddress,
      }),
    };
  });

  return (
    <TableContainer>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={data}
        columns={columns}
        pagination={false}
      />
    </TableContainer>
  );
};

ActiveRegistrationTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  ).isRequired,
};

ActiveRegistrationTable.defaultProps = {};

export default ActiveRegistrationTable;
