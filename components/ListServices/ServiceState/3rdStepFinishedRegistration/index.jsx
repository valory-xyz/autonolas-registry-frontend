import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  Button, Divider, Radio, Form, Input,
} from 'antd';
import PropTypes from 'prop-types';
import { notifyError, notifySuccess } from '@autonolas/frontend-library';

import { SVM_EMPTY_ADDRESS } from 'util/constants';
import {
  FALLBACK_HANDLER,
  multisigAddresses,
  multisigSameAddresses,
} from 'common-util/Contracts/addresses';
import { useHelpers } from 'common-util/hooks';
import { RegistryForm } from 'common-util/TransactionHelpers/RegistryForm';
import { SendTransactionButton } from 'common-util/TransactionHelpers/SendTransactionButton';
import { isValidSolanaPublicKey } from 'common-util/functions';
import { getServiceAgentInstances, onStep3Deploy } from '../utils';
import { handleMultisigSubmit } from './utils';
import { RadioLabel } from '../styles';
import { useFinishRegistration } from '../useSvmServiceStateManagement';

const STEP = 3;
const OPTION_1 = 'Creates a new service multisig with currently registered agent instances';
const OPTION_2 = 'Updates an existent service multisig with currently registered agent instances. Please note that the only service multisig owner must be the current service owner address';

const SvmFinishedRegistration = ({
  isOwner,
  serviceId,
  multisig,
  updateDetails,
  getButton,
  getOtherBtnProps,
  terminateBtn,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSvmStep3Deploy = useFinishRegistration();
  const btnProps = getOtherBtnProps(STEP);

  const onFinish = async (values) => {
    try {
      setIsSubmitting(true);
      await onSvmStep3Deploy(serviceId, values.addressTo);

      updateDetails();
      notifySuccess('Deployed successfully');
    } catch (error) {
      console.error(error);
      notifyError('Error occurred while deploying. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="step-3-finished-registration">
      <Form
        layout="inline"
        preserve={false}
        onFinish={onFinish}
        fields={[{ name: ['addressTo'], value: multisig }]}
        autoComplete="off"
        id="svmFinishedRegistrationForm"
        name="svm-finished-registration-form"
        className="mb-8"
      >
        <Form.Item
          label="Multisig Address"
          name="addressTo"
          rules={[
            { required: false },
            {
              validator: async (_, value) => {
                if (!value || value === SVM_EMPTY_ADDRESS) {
                  return Promise.reject(
                    new Error('Please enter multisig address'),
                  );
                }

                if (!isValidSolanaPublicKey(value)) {
                  return Promise.reject(
                    new Error('Not a valid multisig address'),
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input disabled={btnProps.disabled} size="small" />
        </Form.Item>

        <Form.Item>
          {getButton(
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              {...getOtherBtnProps(STEP, { isDisabled: !isOwner })}
            >
              Submit
            </Button>,
            { step: STEP },
          )}
        </Form.Item>
      </Form>

      {terminateBtn}
    </div>
  );
};

SvmFinishedRegistration.propTypes = {
  multisig: PropTypes.string.isRequired,
  isOwner: PropTypes.bool.isRequired,
  terminateBtn: PropTypes.node,
  getButton: PropTypes.func.isRequired,
  serviceId: PropTypes.string.isRequired,
  getOtherBtnProps: PropTypes.func.isRequired,
  updateDetails: PropTypes.func.isRequired,
};

SvmFinishedRegistration.defaultProps = {
  terminateBtn: null,
};

/**
 * FinishedRegistration component
 */
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

      await updateDetails();
      notifySuccess('Deployed successfully');
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

  const terminateBtn = (
    <>
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
    </>
  );

  if (isSvm) {
    return (
      <SvmFinishedRegistration
        isOwner={isOwner}
        serviceId={serviceId}
        multisig={multisig}
        updateDetails={updateDetails}
        getButton={getButton}
        getOtherBtnProps={getOtherBtnProps}
        terminateBtn={terminateBtn}
      />
    );
  }

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
          name="finished-registration-form"
          autoComplete="off"
          preserve={false}
          id="finishedRegistrationForm"
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

      {terminateBtn}
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
  handleTerminate: PropTypes.func.isRequired,
  getButton: PropTypes.func.isRequired,
  canShowMultisigSameAddress: PropTypes.bool,
  getOtherBtnProps: PropTypes.func.isRequired,
  updateDetails: PropTypes.func.isRequired,
};

FinishedRegistration.defaultProps = {
  canShowMultisigSameAddress: false,
};
