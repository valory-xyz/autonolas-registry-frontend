import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  Button, Divider, Radio, Form, Input,
} from 'antd';
import PropTypes from 'prop-types';
import { notifySuccess } from '@autonolas/frontend-library';

import {
  FALLBACK_HANDLER,
  multisigAddresses,
  multisigSameAddresses,
} from 'common-util/Contracts/addresses';
import { useHelpers } from 'common-util/hooks';
import { RegistryForm } from 'common-util/TransactionHelpers/RegistryForm';
import { SendTransactionButton } from 'common-util/TransactionHelpers/SendTransactionButton';
import { getServiceAgentInstances, onStep3Deploy } from '../utils';
import { handleMultisigSubmit } from './utils';
import { RadioLabel } from '../styles';

const STEP = 3;
const OPTION_1 = 'Creates a new service multisig with currently registered agent instances';
const OPTION_2 = 'Updates an existent service multisig with currently registered agent instances. Please note that the only service multisig owner must be the current service owner address';

export const FinishedRegistration = ({
  isOwner,
  serviceId,
  owner: serviceOwner,
  threshold,
  multisig,
  handleTerminate,
  canShowMultisigSameAddress,
  getOtherBtnProps,
  getButton,
  updateDetails,
}) => {
  const { account, chainId, isSvm } = useHelpers();

  const [form] = Form.useForm();
  const [radioValue, setRadioValue] = useState(null);
  const [agentInstances, setAgentInstances] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTerminating, setIsTerminating] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!isSvm) {
        const response = await getServiceAgentInstances(serviceId);
        if (isMounted) {
          setAgentInstances(response);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [serviceId, chainId, isSvm]);

  const handleStep3Deploy = async (radioValuePassed, payload) => {
    try {
      setIsSubmitting(true);
      await onStep3Deploy(account, serviceId, radioValuePassed, payload);
      notifySuccess('Deployed');
      await updateDetails();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const otherAddress = canShowMultisigSameAddress
    ? multisigSameAddresses[chainId] || []
    : [];
  const options = [...(multisigAddresses[chainId] || []), ...otherAddress];
  const isMultiSig = (multisigAddresses[chainId] || [])[0];

  const btnProps = getOtherBtnProps(STEP);

  return (
    <div className="step-3-finished-registration">
      {options?.length ? (
        <Radio.Group
          value={radioValue}
          onChange={(e) => setRadioValue(e.target.value)}
          disabled={btnProps.disabled}
          className="mt-8"
        >
          {options.map((multisigAddress) => (
            <div className="mb-12" key={`mutisig-${multisigAddress}`}>
              <RadioLabel disabled={btnProps.disabled}>
                {multisigAddress === isMultiSig && OPTION_1}
                {multisigAddress !== isMultiSig && OPTION_2}
              </RadioLabel>

              <Radio key={multisigAddress} value={multisigAddress}>
                {multisigAddress}
              </Radio>
            </div>
          ))}
        </Radio.Group>
      ) : null}

      {/* form should be shown only if 1st radio button is selected
      2nd radio button means everything will be handled by the backend */}
      {radioValue === isMultiSig && (
        <RegistryForm
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
            initialValue={FALLBACK_HANDLER[chainId]}
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
                loading={isSubmitting}
                {...getOtherBtnProps(STEP, {
                  isDisabled: !radioValue || !isOwner,
                })}
              >
                Submit
              </Button>,
              { step: STEP },
            )}
          </Form.Item>
        </RegistryForm>
      )}

      {/* submits the data for 2nd radio button (ie. 2nd multisig option) */}
      {radioValue !== isMultiSig && (
        <div className="mb-12 mt-8">
          {getButton(
            <SendTransactionButton
              type="primary"
              loading={isSubmitting}
              onClick={async () => {
                try {
                  setIsSubmitting(true);
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
                } catch (error) {
                  console.error(error);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              {...getOtherBtnProps(STEP, {
                isDisabled: !radioValue || !isOwner,
              })}
            >
              Submit
            </SendTransactionButton>,
            { step: STEP },
          )}
        </div>
      )}

      <Divider className="m-0" />
      {getButton(
        <SendTransactionButton
          onClick={async () => {
            try {
              setIsTerminating(true);
              await handleTerminate();
            } catch (error) {
              console.error(error);
            } finally {
              setIsTerminating(false);
            }
          }}
          loading={isTerminating}
          className="terminate-btn"
          {...getOtherBtnProps(STEP, { isDisabled: !isOwner })}
        >
          Terminate
        </SendTransactionButton>,
        { step: STEP },
      )}
    </div>
  );
};

FinishedRegistration.propTypes = {
  isOwner: PropTypes.bool.isRequired,
  serviceId: PropTypes.string.isRequired,
  multisig: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
  threshold: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  handleTerminate: PropTypes.func,
  getButton: PropTypes.func.isRequired,
  canShowMultisigSameAddress: PropTypes.bool,
  getOtherBtnProps: PropTypes.func.isRequired,
  updateDetails: PropTypes.func.isRequired,
};

FinishedRegistration.defaultProps = {
  canShowMultisigSameAddress: false,
  handleTerminate: () => {},
};