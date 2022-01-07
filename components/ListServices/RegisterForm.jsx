/* eslint-disable no-console */
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
      name="basic"
      // labelCol={{ flex: '110px' }}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 12 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      // labelWrap
      // labelAlign="left"
    >
      <Form.Item
        label="Owner Address"
        name="owner_address"
        initialValue={
          formInitialValues ? formInitialValues.owner_address : account
        }
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
        initialValue="Description"
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
          <Input />
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
    // TODO: change variable names & add all possible variables
    owner_address: PropTypes.string,
  }),
  handleSubmit: PropTypes.func.isRequired,
};

RegisterForm.defaultProps = {
  isUpdateForm: false,
  account: null,
  listType: 'Service',
  formInitialValues: null,
};

const mapStateToProps = (state) => {
  const { account, balance } = state.setup;
  return { account, balance };
};

export default connect(mapStateToProps, {})(RegisterForm);
