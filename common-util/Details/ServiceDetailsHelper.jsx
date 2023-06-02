/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  Typography,
  Input,
  notification,
  Switch,
} from 'antd/lib';
import { DynamicFieldsForm } from 'common-util/DynamicFieldsForm';
import {
  checkIfServiceIsWhitelisted,
  setOperatorsCheckRequest,
  setOperatorsStatusesRequest,
  checkIfServiceRequiresWhiltelisting,
} from './ServiceState/utils';

const { Text } = Typography;

export const OperatorWhitelist = ({ isOwner, id }) => {
  const account = useSelector((state) => state?.setup?.account);

  const [isCheckLoading, setIsCheckLoading] = useState(false);
  const [isWhiteListed, setIsWhiteListed] = useState(false);
  const [opertorAddress, setOperatorAddress] = useState(null);
  const [switchOne, setSwitchOne] = useState(isWhiteListed);

  // switch
  useEffect(() => {
    setSwitchOne(isWhiteListed);
  }, [isWhiteListed]);

  // get operator whitelist
  const setOpWhitelist = async () => {
    const whiteListRes = await checkIfServiceRequiresWhiltelisting(id);
    setIsWhiteListed(whiteListRes);
  };

  useEffect(() => {
    if (id) {
      setOpWhitelist();
    }
  }, [id]);

  return isWhiteListed ? (
    <>
      <Switch
        disabled={!isOwner}
        checked={switchOne}
        checkedChildren="Enabled"
        unCheckedChildren="Disabled"
        onChange={async (checked) => {
          setSwitchOne(checked);
          if (!checked) {
            await setOperatorsCheckRequest({
              account,
              serviceId: id,
              isChecked: false,
            });
            await setOpWhitelist();
          }
        }}
      />
      <br />

      {/* TODO add form label */}
      <Text>Check if Operator Address is whitelisted?</Text>
      <Input onChange={(e) => setOperatorAddress(e.target.value)} />
      <br />
      <Button
        loading={isCheckLoading}
        onClick={async () => {
          try {
            setIsCheckLoading(true);
            const isValid = await checkIfServiceIsWhitelisted(
              id,
              opertorAddress,
            );

            const message = `Operator ${opertorAddress} is ${
              isValid ? '' : 'not'
            } whitelisted`;
            notification.success({ message });
          } catch (error) {
            console.error(error);
          } finally {
            setIsCheckLoading(false);
          }
        }}
      >
        Check
      </Button>
    </>
  ) : (
    <>
      <Switch
        disabled={!isOwner}
        checkedChildren="Enabled"
        unCheckedChildren="Disabled"
        onChange={async (checked) => {
          setSwitchOne(checked);
          if (checked) {
            await setOperatorsCheckRequest({
              account,
              serviceId: id,
              isChecked: true,
            });
            await setOpWhitelist();
          }
        }}
      />
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
        operatorStatuses: values.status.map((e) => Boolean(e)),
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
      <Text type="secondary">By submitting will instantly enable whitelisting</Text>
    </>
  );
};
