import { useEffect, useState } from 'react';
import {
  Button, Typography, Input, Form,
} from 'antd';
import PropTypes from 'prop-types';
import {
  notifyError,
  notifySuccess,
  notifyWarning,
} from '@autonolas/frontend-library';

import { addressValidator } from '../../functions';
import { useHelpers } from '../../hooks';
import { DynamicFieldsForm } from '../../DynamicFieldsForm';
import {
  checkIfServiceIsWhitelisted,
  setOperatorsStatusesRequest,
} from '../utils';

const { Text } = Typography;

export const OperatorWhitelist = ({ id, isWhiteListed, setOpWhitelist }) => {
  const { account, chainId } = useHelpers();
  const [form] = Form.useForm();

  const [isCheckLoading, setIsCheckLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      await setOpWhitelist(id);
    };

    if (id && setOpWhitelist) getData();
  }, [id, chainId, setOpWhitelist]);

  const onCheck = async (values) => {
    try {
      setIsCheckLoading(true);
      const isValid = await checkIfServiceIsWhitelisted(
        id,
        values.operatorAddress,
      );

      const message = `Operator ${values.operatorAddress} is ${
        isValid ? '' : 'NOT'
      } whitelisted`;
      if (isValid) notifySuccess(message);
      else notifyWarning(message);
    } catch (error) {
      console.error(error);
    } finally {
      setIsCheckLoading(false);
    }
  };

  if (!isWhiteListed) return null;
  return (
    <>
      <Text>Check if Operator Address is whitelisted?</Text>
      <Form
        layout="inline"
        form={form}
        name="operator_address_form"
        autoComplete="off"
        onFinish={onCheck}
      >
        <Form.Item
          label="Operator Address"
          name="operatorAddress"
          rules={[
            { required: true, message: 'Please input the address' },
            addressValidator,
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button
            htmlType="submit"
            loading={isCheckLoading}
            disabled={!account}
          >
            Check
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
OperatorWhitelist.propTypes = {
  id: PropTypes.string,
  isWhiteListed: PropTypes.bool,
  setOpWhitelist: PropTypes.func,
};
OperatorWhitelist.defaultProps = {
  id: '',
  isWhiteListed: false,
  setOpWhitelist: null,
};

export const SetOperatorStatus = ({ id, setOpWhitelist }) => {
  const { account } = useHelpers();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const onSubmit = async (values) => {
    try {
      setIsSubmitLoading(true);
      await setOperatorsStatusesRequest({
        account,
        serviceId: id,
        operatorAddresses: values.operatorAddress,
        operatorStatuses: values.status.map((e) => e === 'true'),
      });
      await setOpWhitelist();
      notifySuccess('Operator status updated');
    } catch (error) {
      console.error(error);
      notifyError('Error occurred while updating operator status');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <>
      <DynamicFieldsForm
        isLoading={isSubmitLoading}
        onSubmit={onSubmit}
        submitButtonText="Submit"
      />
      <Text type="secondary">
        By submitting will instantly enable whitelisting
      </Text>
    </>
  );
};
SetOperatorStatus.propTypes = {
  id: PropTypes.string,
  setOpWhitelist: PropTypes.func,
};
SetOperatorStatus.defaultProps = {
  id: '',
  setOpWhitelist: null,
};
