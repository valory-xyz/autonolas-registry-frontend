import { useState } from 'react';
import Web3 from 'web3';
import { useRouter } from 'next/router';
import useDeepCompareEffect from 'use-deep-compare-effect';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { Button, Form, Input } from 'antd/lib';
import { WhiteButton } from 'common-util/components/Button';
import { commaMessage, DependencyLabel } from 'common-util/List/ListCommon';
import { FormItemHash } from 'common-util/List/RegisterForm/helpers';
import IpfsHashGenerationModal from 'common-util/List/IpfsHashGenerationModal';
import { ComplexLabel } from 'common-util/List/styles';
import { RegisterFooter } from 'components/styles';

export const FORM_NAME = 'serviceRegisterForm';
export const getAgentSlots = (info) => (info.agentParams || []).map((param) => param[0]);
export const getBonds = (info) => (info.agentParams || []).map((param) => param[1]);

const RegisterForm = ({
  account,
  listType,
  isUpdateForm,
  formInitialValues,
  handleSubmit,
  handleCancel,
}) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fields, setFields] = useState([]);
  const router = useRouter();
  const id = get(router, 'query.id') || null;

  const onGenerateHash = (generatedHash) => {
    setFields([
      {
        name: ['hash'],
        value: generatedHash || null,
      },
    ]);
  };

  useDeepCompareEffect(() => {
    if (isUpdateForm) {
      const agentNumSlots = (formInitialValues.agentParams || [])
        .map((param) => param[0])
        .join(', ');
      const bonds = (formInitialValues.agentParams || [])
        .map((param) => param[1])
        .join(', ');

      setFields([
        {
          name: ['owner_address'],
          value: formInitialValues.owner || null,
        },
        {
          name: ['hash'],
          value: get(formInitialValues, 'configHash'),
        },
        {
          name: ['agent_ids'],
          value: formInitialValues.agentIds
            ? formInitialValues.agentIds.join(', ')
            : null,
        },
        {
          name: ['agent_num_slots'],
          value: agentNumSlots,
        },
        {
          name: ['bonds'],
          value: bonds,
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
    window.console.log('Failed:', errorInfo);
  };

  const prefillOwnerAddress = () => {
    form.setFieldsValue({ owner_address: account });
  };

  const hashValue = form.getFieldValue('hash');

  return (
    <>
      <Form
        name={FORM_NAME}
        form={form}
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
          validateFirst
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
          className="mb-0"
        >
          <Input placeholder="0x862..." disabled={isUpdateForm} />
        </Form.Item>

        <Form.Item className="mb-0">
          <Button
            htmlType="button"
            type="link"
            onClick={prefillOwnerAddress}
            className="pl-0"
          >
            Prefill Address
          </Button>
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

        <FormItemHash listType={listType} hashValue={hashValue} />

        <Button
          type="primary"
          ghost
          onClick={() => setIsModalVisible(true)}
          className="mb-12"
        >
          {isUpdateForm ? 'Update' : 'Generate'}
          &nbsp;Hash & File
        </Button>

        <Form.Item
          name="agent_ids"
          validateFirst
          label={(
            <ComplexLabel>
              Canonical agent Ids
              <DependencyLabel type="service" />
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
          label={(
            <ComplexLabel>
              No. of slots to canonical agent Ids
              <div className="label-helper-text">
                Specify the number of agent instances for each canonical agent
                listed above. Each canonical agent must have at least one
                instance.&nbsp;
                {commaMessage}
              </div>
            </ComplexLabel>
          )}
          name="agent_num_slots"
          validateFirst
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
          label="Cost of agent instance bond"
          name="bonds"
          rules={[
            {
              required: true,
              message: 'Please input the cost of agent instance bond',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Threshold"
          name="threshold"
          tooltip="min should equal <= 2/3 No. of slots"
          rules={[
            {
              required: true,
              message: 'Please input the threshold',
            },
          ]}
        >
          <Input />
        </Form.Item>

        {account ? (
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        ) : (
          <RegisterFooter>
            <p>To register, connect to wallet</p>
            <WhiteButton onClick={handleCancel}>Cancel</WhiteButton>
          </RegisterFooter>
        )}
      </Form>

      <IpfsHashGenerationModal
        visible={isModalVisible}
        type={listType}
        callback={onGenerateHash}
        handleCancel={() => setIsModalVisible(false)}
      />
    </>
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
    configHash: PropTypes.array,
    agentIds: PropTypes.arrayOf(PropTypes.string),
    agentNumSlots: PropTypes.arrayOf(PropTypes.string),
    agentParams: PropTypes.arrayOf(PropTypes.array),
    threshold: PropTypes.string,
  }),
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
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
