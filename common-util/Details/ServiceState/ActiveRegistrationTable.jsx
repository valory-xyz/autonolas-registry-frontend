/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Form, Input, Table } from 'antd';
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';

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
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const onSave = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (info) {
      window.console.log('Save failed:', info);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input.TextArea
          ref={inputRef}
          onPressEnter={onSave}
          onBlur={onSave}
          placeholder="0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199, 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199, 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"
        />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

/**
 * Table
 */
const ActiveRegistrationTable = ({ data, defaultColumns, setDataSource }) => {
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

  const columns = defaultColumns.map((c) => {
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
