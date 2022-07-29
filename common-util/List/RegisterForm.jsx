import { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Web3 from 'web3';
import { Button, Form, Input } from 'antd/lib';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import { HASH_PREFIX } from 'util/constants';
import { WhiteButton } from 'common-util/components/Button';
import IpfsHashGenerationModal, { getBase16Validator } from './IpfsHashGenerationModal';
import { DependencyLabel } from './ListCommon';
import { RegisterFooter, ComplexLabel } from './styles';

export const FORM_NAME = 'register_form';

const RegisterForm = ({
  account, listType, handleSubmit, handleCancel,
}) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fields, setFields] = useState([]);

  const onGenerateHash = (generatedHash) => {
    setFields([
      {
        name: ['hash'],
        value: generatedHash || null,
      },
    ]);
  };

  const onFinish = (values) => {
    if (account) {
      handleSubmit(values);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo); /* eslint-disable-line no-console */
  };

  const prefillOwnerAddress = () => {
    form.setFieldsValue({ owner_address: account });
  };

  return (
    <>
      <Form
        form={form}
        name={FORM_NAME}
        initialValues={{ remember: true }}
        fields={fields}
        layout="vertical"
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
          <Input placeholder="0x862..." />
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

        <Form.Item
          label="Hash"
          name="hash"
          rules={[
            {
              required: true,
              message: `Please input the IPFS hash of the ${listType}`,
            },
            () => ({
              validator(_, value) {
                return getBase16Validator(value);
              },
            }),
          ]}
        >
          <Input addonBefore={HASH_PREFIX} />
        </Form.Item>

        <Button
          type="primary"
          ghost
          onClick={() => setIsModalVisible(true)}
          className="mb-12"
        >
          Generate Hash
        </Button>

        <Form.Item
          label={(
            <ComplexLabel>
              Dependencies
              <DependencyLabel />
            </ComplexLabel>
          )}
          name="dependencies"
          validateFirst
          rules={[
            {
              required: false,
              message: `Please input the list of ${listType}s on which this ${listType} depends`,
            },
            () => ({
              validator(_, value) {
                // even empty value is accepted as it is not required
                if (isNil(value) || value === '') {
                  return Promise.resolve();
                }

                /**
                 * https://regex101.com/r/ip1z51/1
                 * accepts comma seperated values, examples below
                 * eg
                 * 1,2,4,2
                 * 2,3,4
                 * 4,   2,4,5
                 * 2,3     ,4
                 * 7
                 */
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
  account: PropTypes.string,
  listType: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

RegisterForm.defaultProps = {
  account: null,
  listType: '',
};

const mapStateToProps = (state) => {
  const account = get(state, 'setup.account') || null;
  return { account };
};

export default connect(mapStateToProps, {})(RegisterForm);
