/* eslint-disable no-console */
// import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Web3 from 'web3';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import {
  Button, Typography, Form, Input, notification,
} from 'antd';
import { CONTRACT, CONTRACT_ADDRESS } from './helpers/mechMinter';
import { RegisterFooter } from '../styles';

const { Title } = Typography;

const RegisterComponents = ({ account }) => {
  const router = useRouter();

  const handleCancel = () => {
    router.push('/');
  };

  const onFinish = (values) => {
    if (account) {
      window.ethereum.enable();
      const web3 = new Web3(window.web3.currentProvider);

      // contractAddress and abi are setted after contract deploy
      const contract = new web3.eth.Contract(CONTRACT.abi, CONTRACT_ADDRESS);

      console.log({ contract });
      contract.methods
        .mintComponent(
          values.dev_address,
          values.to_address,
          values.hash,
          values.description,
          values.dependecies ? values.dependecies.split(', ') : [],
        )
        .call()
        .then((tx) => {
          console.log('Transaction: ', tx);
          notification.success({ message: 'Component Minted' });
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Title level={2}>Register Component</Title>
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
            label="Developer Address"
            name="dev_address"
            initialValue={account}
            rules={[
              {
                required: true,
                message: 'Please input your Developer address',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="To Address"
            name="to_address"
            initialValue={account}
            rules={[
              { required: true, message: 'Please input your To address' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Hash"
            name="hash"
            initialValue="0x0"
            rules={[{ required: true, message: 'Please input your Hash' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            initialValue="Description"
            rules={[
              { required: true, message: 'Please input your Description' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Dependencies (comma seperated)"
            name="dependecies"
            rules={[
              { required: false, message: 'Please input the list of components on which this component depends' },
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

RegisterComponents.propTypes = {
  account: PropTypes.string,
};

RegisterComponents.defaultProps = {
  account: null,
};

const mapStateToProps = (state) => {
  const { account, balance } = state.setup;
  return { account, balance };
};

export default connect(mapStateToProps, {})(RegisterComponents);
