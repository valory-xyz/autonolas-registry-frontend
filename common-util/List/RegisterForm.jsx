/* eslint-disable no-console */
import PropTypes from 'prop-types';
// import { ethers } from 'ethers';
import { connect } from 'react-redux';
import { Button, Form, Input } from 'antd';
import { RegisterFooter } from './styles';

const RegisterForm = ({
  account, listType, handleSubmit, handleCancel,
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
    <>
      {account ? (
        <Form
          name="basic"
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
            initialValue={account}
            rules={[
              {
                required: true,
                message: `Please input the address of the ${listType} Owner`,
              },
              // TODO
              // {
              //   required: ethers.utils.isAddress(account),
              //   message: `Please input the valid address of the ${listType} Owner`,
              // },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Developer Address"
            name="developer_address"
            initialValue={account}
            rules={[
              {
                required: true,
                message: `Please input the address to which the ${listType} Developer`,
              },
              // TODO
              // {
              //   required: ethers.utils.isAddress(account),
              //   message: `Please input the valid address of the ${listType} Owner`,
              // },
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
            label="Dependencies (comma seperated)"
            name="dependencies"
            rules={[
              {
                required: false,
                message: `Please input the list of ${listType}s on which this ${listType} depends`,
              },
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
  const { account, balance } = state.setup;
  return { account, balance };
};

export default connect(mapStateToProps, {})(RegisterForm);
