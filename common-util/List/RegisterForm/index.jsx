import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input } from 'antd';
import isNil from 'lodash/isNil';
import { isValidAddress } from '@autonolas/frontend-library';

import { useHelpers } from 'common-util/hooks';
import IpfsHashGenerationModal from '../IpfsHashGenerationModal';
import { DependencyLabel } from '../ListCommon';
import { FormItemHash } from './helpers';
import { RegisterFooter, ComplexLabel } from '../styles';

export const FORM_NAME = 'register_form';

const RegisterForm = ({
  isLoading, listType, handleSubmit, handleCancel,
}) => {
  const { account } = useHelpers();

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

  const hashValue = form.getFieldValue('hash');

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
                if (isValidAddress(value)) return Promise.resolve();
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

        <FormItemHash listType={listType} hashValue={hashValue} />

        <Button
          type="primary"
          ghost
          onClick={() => setIsModalVisible(true)}
          className="mb-12"
        >
          Generate Hash & File
        </Button>

        <Form.Item
          label={(
            <ComplexLabel>
              Dependencies
              <DependencyLabel type={listType} />
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
          <Input placeholder="2, 10, 15" />
        </Form.Item>

        {account ? (
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Submit
            </Button>
          </Form.Item>
        ) : (
          <RegisterFooter>
            <p>To mint, connect to wallet</p>
            {handleCancel && (
              <Button type="default" onClick={handleCancel}>
                Cancel
              </Button>
            )}
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
  isLoading: PropTypes.bool,
  listType: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

RegisterForm.defaultProps = {
  isLoading: false,
  listType: '',
};

export default RegisterForm;
