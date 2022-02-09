import { useState } from 'react';
import Web3 from 'web3';
import { useRouter } from 'next/router';
import useDeepCompareEffect from 'use-deep-compare-effect';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { Button, Form, Input } from 'antd';
import { DependencyLabel } from 'common-util/List/ListCommon';
import { ComplexLabel } from 'common-util/List/styles';

export const FORM_NAME = 'serviceRegisterForm';

const RegisterForm = ({
  account,
  listType,
  handleSubmit,
  isUpdateForm,
  formInitialValues,
}) => {
  const [fields, setFields] = useState([]);
  const router = useRouter();
  const id = get(router, 'query.id') || null;

  useDeepCompareEffect(() => {
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
          value: formInitialValues.agentIds
            ? formInitialValues.agentIds.join(', ')
            : null,
        },
        {
          name: ['agent_num_slots'],
          value: formInitialValues.agentNumSlots
            ? formInitialValues.agentNumSlots.join(', ')
            : null,
        },
        {
          name: ['threshold'],
          value: formInitialValues.threshold || null,
        },
        {
          name: ['service_id'],
          value: id,
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
    console.log('Failed:', errorInfo); /* eslint-disable-line no-console */
  };

  return (
    <Form
      name={FORM_NAME}
      initialValues={{ remember: true }}
      layout="vertical"
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
          () => ({
            validator(_, value) {
              if (Web3.utils.isAddress(value)) return Promise.resolve();
              return Promise.reject(
                new Error(
                  `Please input a valid address of the ${listType} Owner`,
                ),
              );
            },
          }),
        ]}
      >
        <Input placeholder="0x862..." disabled={isUpdateForm} />
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
        name="agent_ids"
        validateFirst
        label={(
          <ComplexLabel>
            Canonical agent Ids
            <DependencyLabel type="agent" />
          </ComplexLabel>
        )}
        rules={[
          {
            required: true,
            message: 'Please input the agent Ids',
          },
          () => ({
            validator(_, value) {
              if (/^\d+(\s*,\s*\d+?)*$/gm.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Please input a valid list'));
            },
          }),
        ]}
      >
        <Input placeholder="2, 10, 15, 26" />
      </Form.Item>

      <Form.Item
        label="No. of slots to canonical agent Ids"
        name="agent_num_slots"
        validateFirst
        tooltip="(comma seperated)"
        rules={[
          {
            required: true,
            message: 'Please input the slots to canonical agent Ids',
          },
          () => ({
            validator(_, value) {
              if (/^\d+(\s*,\s*\d+?)*$/gm.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Please input a valid list'));
            },
          }),
        ]}
      >
        <Input placeholder="1, 2, 1, 2" />
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

      <Form.Item>
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
    threshold: PropTypes.string,
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
  const { account } = state.setup;
  return { account };
};

export default connect(mapStateToProps, {})(RegisterForm);
