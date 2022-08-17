import { useState } from 'react';
import { ethers } from 'ethers';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  Button,
  Space,
  Divider,
  Radio,
  Typography,
  Form,
  Input,
} from 'antd/lib';
import { multisigAddresses } from 'common-util/Contracts';

const StepThreePayload = ({ handleStep3Deploy, handleTerminate }) => {
  const chainId = useSelector((state) => get(state, 'setup.chainId'));
  const [form] = Form.useForm();
  const [radioValue, setRadioValue] = useState(null);
  const onFinish = (values) => {
    const payload = ethers.utils.solidityPack(
      [
        'address',
        'address',
        'address',
        'address',
        'uint256',
        'uint256',
        'bytes',
      ],
      [
        values.addressTo,
        values.addressFallbackHandler,
        values.paymentToken,
        values.payablePaymentReceiver,
        Number(values.payment),
        Number(values.nonce),
        values.payload,
      ],
    );

    handleStep3Deploy(radioValue, payload);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo); /* eslint-disable-line no-console */
  };

  return (
    <div className="step-3-finished-registration">
      <div>
        <Typography.Text>Choose multi-sig implementation:</Typography.Text>
      </div>

      <Radio.Group
        value={radioValue}
        onChange={(e) => setRadioValue(e.target.value)}
      >
        <Space direction="vertical" size={10}>
          {(multisigAddresses[chainId] || []).map((multisigAddress) => (
            <Radio key={multisigAddress} value={multisigAddress}>
              {multisigAddress}
            </Radio>
          ))}
        </Space>
      </Radio.Group>

      <Form
        form={form}
        layout="vertical"
        name="mult-sig-form"
        autoComplete="off"
        preserve={false}
        id="myForm"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="To"
          name="addressTo"
          rules={[{ required: false }]}
          initialValue="0x0000000000000000000000000000000000000000"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Fallback Handler"
          name="addressFallbackHandler"
          rules={[{ required: true, message: 'Please input Fallback Handler' }]}
          initialValue="0xf48f2b2d2a534e402487b3ee7c18c33aec0fe5e4"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Payment Token"
          name="paymentToken"
          rules={[{ required: false }]}
          initialValue="0x0000000000000000000000000000000000000000"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Payable PaymentReceiver"
          name="payablePaymentReceiver"
          rules={[{ required: false }]}
          initialValue="0x0000000000000000000000000000000000000000"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Payment"
          name="payment"
          rules={[{ required: false }]}
          initialValue={0}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Nonce"
          name="nonce"
          rules={[{ required: true, message: 'Please input Nonce' }]}
          initialValue={parseInt(Date.now() / 1000, 10)}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Payload"
          name="payload"
          rules={[{ required: false }]}
          initialValue="0x0000000000000000000000000000000000000000000000000000000000000000"
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={!radioValue}>
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Divider className="m-0" />
      <Button onClick={handleTerminate} className="terminate-btn">
        Terminate
      </Button>
    </div>
  );
};

StepThreePayload.propTypes = {
  handleStep3Deploy: PropTypes.func,
  handleTerminate: PropTypes.func,
};

StepThreePayload.defaultProps = {
  handleStep3Deploy: () => {},
  handleTerminate: () => {},
};

export default StepThreePayload;
