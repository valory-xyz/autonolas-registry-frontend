import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Web3 from 'web3';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import { Button, Form, Input } from 'antd';
import { RegisterFooter } from './styles';

export const FORM_NAME = 'register_form';

const RegisterForm = ({
  account, listType, handleSubmit, handleCancel,
}) => {
  const onFinish = (values) => {
    if (account) {
      handleSubmit(values);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo); /* eslint-disable-line no-console */
  };

  return (
    <>
      {account ? (
        <Form
          name={FORM_NAME}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
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
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Developer Address"
            name="developer_address"
            rules={[
              {
                required: true,
                message: `Please input the address to which the ${listType} Developer`,
              },
              () => ({
                validator(_, value) {
                  if (Web3.utils.isAddress(value)) return Promise.resolve();
                  return Promise.reject(
                    new Error(
                      `Please input a valid address of the ${listType} Developer`,
                    ),
                  );
                },
              }),
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Hash"
            name="hash"
            initialValue="0x0"
            rules={[
              {
                required: true,
                message: `Please input the IPFS hash of the ${listType}`,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
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
            label="Dependencies"
            name="dependencies"
            tooltip="(comma seperated)"
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
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <RegisterFooter>
          <p>To register, connect to wallet</p>
          <Button onClick={handleCancel}>Cancel</Button>
        </RegisterFooter>
      )}
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
