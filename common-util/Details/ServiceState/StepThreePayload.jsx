import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import WalletConnectProvider from '@walletconnect/web3-provider';
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
import { GNOSIS_SAFE_CONTRACT } from 'common-util/AbiAndAddresses';
import { getServiceAgentInstances } from './utils';

const safeContracts = require('@gnosis.pm/safe-contracts');
// MULTI_SEND_CONTRACT

const StepThreePayload = ({
  serviceId,
  owner: serviceOwner,
  threshold,
  multisig,
  handleStep3Deploy,
  handleTerminate,
  canShowMultisigSameAddress,
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

  useEffect(async () => {
    const response = await getServiceAgentInstances(serviceId);
    setAgentInstances(response);
  }, []);

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo); /* eslint-disable-line no-console */
  };

  const otherAddress = canShowMultisigSameAddress
    ? multisigSameAddresses[chainId] || []
    : [];
  const options = [...(multisigAddresses[chainId] || []), ...otherAddress];
  const isMultiSig = (multisigAddresses[chainId] || [])[0];

  console.log({ safeContracts });

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

          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={!radioValue}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}

      {radioValue !== isMultiSig && (
        <Button
          type="primary"
          disabled={!radioValue}
          onClick={async () => {
            const data = ethers.utils.solidityPack(['address'], [multisig]);
            // const multisigContract = await ethers.getContractFactory('GnosisSafe');

            //             const provider = new providers.Web3Provider(web3);
            // const signer = provider.getSigner()
            // const address = await signer.getAddress();

            const network = {
              name: 'dev',
              chainId: 1337,
              ensAddress: 'https://chain.staging.autonolas.tech/',
            };

            const multisigContract = new ethers.Contract(
              multisig,
              GNOSIS_SAFE_CONTRACT.abi,
              ethers.getDefaultProvider('https://chain.staging.autonolas.tech/'),
              // window.WEB3_PROVIDER.eth.currentProvider,
              // ethers.providers.getNetwork(31337),
              // WalletConnectProvider,
              // window.web3.currentProvider,
            );

            const nonce = await multisigContract.nonce();

            console.log(agentInstances);
            console.log({
              multisig,
              data,
              threshold,
              multisigContract,
              nonce,
            });

            const callData = [];
            const txs = [];

            // Add the addresses, but keep the threshold the same
            for (let i = 0; i < agentInstances.length; i += 1) {
              callData[i] = multisigContract.interface.encodeFunctionData(
                'addOwnerWithThreshold',
                [agentInstances[i], threshold],
              );
              txs[i] = safeContracts.buildSafeTransaction({
                to: multisig,
                data: callData[i],
                nonce: 0,
              });
            }

            callData.push(
              multisigContract.interface.encodeFunctionData('removeOwner', [
                agentInstances[0],
                serviceOwner,
                threshold,
              ]),
            );
            txs.push(
              safeContracts.buildSafeTransaction({
                to: multisig,
                data: callData[callData.length - 1],
                nonce: 0,
              }),
            );

            console.log('===========-========');
            console.log({
              callData,
              txs,
            });

            // handleStep3Deploy(radioValue, data);
          }}
        >
          Submit 2
        </Button>
      )}

      <Divider className="m-0" />
      <Button onClick={handleTerminate} className="terminate-btn">
        Terminate
      </Button>
    </div>
  );
};

StepThreePayload.propTypes = {
  serviceId: PropTypes.string.isRequired,
  multisig: PropTypes.string.isRequired,
  threshold: PropTypes.string.isRequired,
  handleStep3Deploy: PropTypes.func,
  handleTerminate: PropTypes.func,
  canShowMultisigSameAddress: PropTypes.bool,
};

StepThreePayload.defaultProps = {
  handleStep3Deploy: () => {},
  handleTerminate: () => {},
  canShowMultisigSameAddress: false,
};

export default StepThreePayload;
