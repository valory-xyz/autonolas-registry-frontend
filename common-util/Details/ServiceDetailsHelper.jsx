/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button, Typography, Input, notification, Form,
} from 'antd/lib';
import { DynamicFieldsForm } from 'common-util/DynamicFieldsForm';
import { addressValidator } from 'common-util/functions';
import {
  checkIfServiceIsWhitelisted,
  setOperatorsStatusesRequest,
} from './ServiceState/utils';

const { Text } = Typography;

export const OperatorWhitelist = ({ isWhiteListed, setOpWhitelist, id }) => {
  const account = useSelector((state) => state?.setup?.account);
  const [form] = Form.useForm();

  const [isCheckLoading, setIsCheckLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      await setOpWhitelist(id);
    };

    if (id) getData();
  }, [id]);

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
      if (isValid) {
        notification.success({ message });
      } else {
        notification.warn({ message });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsCheckLoading(false);
    }
  };

  return (
    <>
      {isWhiteListed && (
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
      )}
    </>
  );
};

export const SetOperatorStatus = ({ id }) => {
  const account = useSelector((state) => state?.setup?.account);
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
      notification.success({
        message: 'Operator status updated',
      });
    } catch (error) {
      console.error(error);
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
