/* eslint-disable no-console */
import { useState } from 'react';
import { useRouter } from 'next/router';
import useDeepCompareEffect from 'use-deep-compare-effect';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form, Input } from 'antd';

const RegisterForm = ({
  account,
  listType,
  handleSubmit,
  isUpdateForm,
  formInitialValues,
}) => {
  const [fields, setFields] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  useDeepCompareEffect(() => {
    console.log(formInitialValues);
    if (isUpdateForm) {
      setFields([
        {
          name: ['owner_address'],
          value: formInitialValues.owner || null,
        },
        {
          name: ['service_name'],
          value: formInitialValues.name || null,
        },
        {
          name: ['service_description'],
          value: formInitialValues.description || null,
        },
        {
          name: ['agent_ids'],
          value: formInitialValues.agentIds ? formInitialValues.agentIds.join(', ') : null,
        },
        {
          name: ['agent_num_slots'],
          value: formInitialValues.agentNumSlots ? formInitialValues.agentNumSlots.join(', ') : null,
        },
        {
          name: ['operator_slots'],
          // TODO: slots from backend?
          value: formInitialValues.operator_slots ? formInitialValues.operator_slots.join(', ') : null,
        },
        {
          name: ['threshold'],
          // TODO: threshold from backend?
          value: formInitialValues.threshold ? formInitialValues.threshold.join(', ') : null,
        },
        {
          name: ['service_id'],
          value: id,
          // TODO: service_id from backend?
          // value: formInitialValues.service_id ? formInitialValues.service_id.join(', ') : null,
        },
      ]);
    }
  }, [formInitialValues, isUpdateForm]);

  /**
   * form helper functions
   */
  const onFinish = (values) => {
    if (account) {
      handleSubmit(values);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="serviceRegisterForm"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 12 }}
      initialValues={{ remember: true }}
      fields={fields}
      onFieldsChange={(_, allFields) => {
        setFields(allFields);
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Owner Address"
        name="owner_address"
        rules={[
          {
            required: true,
            message: `Please input the address of the ${listType} Owner`,
          },
        ]}
      >
        <Input disabled={isUpdateForm} />
      </Form.Item>

      <Form.Item
        label="Service Name"
        name="service_name"
        rules={[
          {
            required: true,
            message: `Please input the ${listType} name`,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Service Description"
        name="service_description"
        rules={[
          {
            required: true,
            message: `Please input the ${listType} Description`,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Canonical agent Ids"
        name="agent_ids"
        tooltip="(comma seperated)"
        rules={[
          {
            required: true,
            message: 'Please input the agent Ids',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="No. of slots to canonical agent Ids"
        name="agent_num_slots"
        tooltip="(comma seperated)"
        rules={[
          {
            required: true,
            message: 'Please input the slots to canonical agent Ids',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Min Max Operator Slot"
        name="operator_slots"
        tooltip="(comma seperated)"
        rules={[
          {
            required: true,
            message: 'Please input the list of min-max operator slots',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Threshold"
        name="threshold"
        rules={[
          {
            required: true,
            message: 'Please input the threshold',
          },
        ]}
      >
        <Input />
      </Form.Item>

      {isUpdateForm && (
        <Form.Item
          label="Service Id"
          name="service_id"
          rules={[
            {
              required: true,
              message: 'Please input the Service ID',
            },
          ]}
        >
          <Input disabled={isUpdateForm} />
        </Form.Item>
      )}

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

RegisterForm.propTypes = {
  isUpdateForm: PropTypes.bool,
  account: PropTypes.string,
  listType: PropTypes.string,
  formInitialValues: PropTypes.shape({
    owner: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    agentIds: PropTypes.arrayOf(PropTypes.string),
    agentNumSlots: PropTypes.arrayOf(PropTypes.string),
    operator_slots: PropTypes.arrayOf(PropTypes.string),
    threshold: PropTypes.arrayOf(PropTypes.string),
  }),
  handleSubmit: PropTypes.func.isRequired,
};

RegisterForm.defaultProps = {
  isUpdateForm: false,
  account: null,
  listType: 'Service',
  formInitialValues: {},
};

const mapStateToProps = (state) => {
  const { account, balance } = state.setup;
  return { account, balance };
};

export default connect(mapStateToProps, {})(RegisterForm);
