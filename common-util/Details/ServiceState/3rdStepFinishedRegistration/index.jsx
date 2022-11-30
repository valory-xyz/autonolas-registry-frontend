import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
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
import {
  multisigAddresses,
  multisigSameAddresses,
} from 'common-util/Contracts';
import { getServiceAgentInstances } from '../utils';
import { handleMultisigSubmit } from './utils';

const STEP = 3;

const StepThreePayload = ({
  isOwner,
  serviceId,
  owner: serviceOwner,
  threshold,
  multisig,
  handleStep3Deploy,
  handleTerminate,
  canShowMultisigSameAddress,
  getOtherBtnProps,
  getButton,
  account,
}) => {
  const chainId = useSelector((state) => get(state, 'setup.chainId'));
  const [form] = Form.useForm();
  const [radioValue, setRadioValue] = useState(null);
  const [agentInstances, setAgentInstances] = useState(null);
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

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const response = await getServiceAgentInstances(serviceId);
      if (isMounted) {
        setAgentInstances(response);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo); /* eslint-disable-line no-console */
  };

  const otherAddress = canShowMultisigSameAddress
    ? multisigSameAddresses[chainId] || []
    : [];
  const options = [...(multisigAddresses[chainId] || []), ...otherAddress];
  const isMultiSig = (multisigAddresses[chainId] || [])[0];

  const btnProps = getOtherBtnProps(STEP);

  return (
    <div className="step-3-finished-registration">
      <div>
        <Typography.Text>Choose multi-sig implementation:</Typography.Text>
      </div>

      <Radio.Group
        value={radioValue}
        onChange={(e) => setRadioValue(e.target.value)}
        disabled={btnProps.disabled}
      >
        <Space direction="vertical" size={10}>
          {options.map((multisigAddress) => (
            <Radio key={multisigAddress} value={multisigAddress}>
              {multisigAddress}
            </Radio>
          ))}
        </Space>
      </Radio.Group>

      {/* form should be shown only if 1st radio button is selected
      2nd radio button means everything will be handled by the backend */}
      {radioValue === isMultiSig && (
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
            rules={[
              { required: true, message: 'Please input Fallback Handler' },
            ]}
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
            initialValue="0x"
          >
            <Input />
          </Form.Item>

          <Form.Item style={{ marginBottom: 8 }}>
            {getButton(
              <Button
                type="primary"
                htmlType="submit"
                {...getOtherBtnProps(STEP, { isDisabled: !radioValue || !isOwner })}
              >
                Submit
              </Button>,
              { step: STEP },
            )}
          </Form.Item>
        </Form>
      )}

      {/* submits the data for 2nd radio button (ie. 2nd multisig option) */}
      {radioValue !== isMultiSig && (
        <div className="mb-12 mt-8">
          {getButton(
            <Button
              type="primary"
              onClick={async () => {
                await handleMultisigSubmit({
                  multisig,
                  threshold,
                  agentInstances,
                  serviceOwner,
                  chainId,
                  handleStep3Deploy,
                  radioValue,
                  account,
                });
              }}
              {...getOtherBtnProps(STEP, {
                isDisabled: !radioValue || !isOwner,
              })}
            >
              Submit
            </Button>,
            { step: STEP },
          )}
        </div>
      )}

      <Divider className="m-0" />
      {getButton(
        <Button
          onClick={handleTerminate}
          className="terminate-btn"
          {...getOtherBtnProps(STEP, { isDisabled: !isOwner })}
        >
          Terminate
        </Button>,
        { step: STEP },
      )}
    </div>
  );
};

StepThreePayload.propTypes = {
  isOwner: PropTypes.bool.isRequired,
  serviceId: PropTypes.string.isRequired,
  multisig: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
  threshold: PropTypes.string.isRequired,
  handleStep3Deploy: PropTypes.func,
  handleTerminate: PropTypes.func,
  getButton: PropTypes.func.isRequired,
  canShowMultisigSameAddress: PropTypes.bool,
  getOtherBtnProps: PropTypes.func.isRequired,
  account: PropTypes.string.isRequired,
};

StepThreePayload.defaultProps = {
  canShowMultisigSameAddress: false,
  handleStep3Deploy: () => {},
  handleTerminate: () => {},
};

export default StepThreePayload;
