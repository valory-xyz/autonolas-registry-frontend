/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useContext, useRef } from 'react';
import { Form, Input, Table } from 'antd/lib';
import { get } from 'lodash';

const STEP_2_TABLE_COLUMNS = [
  {
    title: 'Agent ID',
    dataIndex: 'agentId',
    key: 'agentId',
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
  },
  {
    title: 'Agent Instance Addresses',
    dataIndex: 'agentAddresses',
    key: 'agentAddresses',
    width: '40%',
    editable: true,
  },
];

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

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const form = useContext(EditableContext);
  const inputRef = useRef(null);

  if (record) {
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  }

  const onSave = async () => {
    try {
      const values = await form.validateFields();
      handleSave({ ...record, ...values });
    } catch (info) {
      window.console.log('Save failed:', info);
    }
  };

  let childNode = children;
  const slots = get(record, 'availableSlots') || 0;

  if (editable) {
    childNode = slots > 0 ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        <Input.TextArea
          ref={inputRef}
          onPressEnter={onSave}
          onBlur={onSave}
          placeholder={[...new Array(slots)].map((_i, index) => `Address ${index + 1}`).join(', ')}
        />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

/**
 * Table
 */
const ActiveRegistrationTable = ({ data, setDataSource }) => {
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

    return {
      ...c,
      onCell: (record) => ({
        record,
        editable: c.editable,
        dataIndex: c.dataIndex,
        title: c.title,
        handleSave,
      }),
    };
  });

  return (
    <div>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={data}
        columns={columns}
        pagination={false}
      />
    </div>
  );
};

export default ActiveRegistrationTable;
