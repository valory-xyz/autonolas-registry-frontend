import { useCallback, useEffect, useState } from 'react';
import { Switch } from 'antd';
import {
  checkIfServiceRequiresWhitelisting,
  setOperatorsCheckRequest,
} from '../ServiceState/utils';
import { useHelpers } from '../../hooks';
import { OperatorWhitelist, SetOperatorStatus } from './OperatorWhitelist';

const useOperatorWhitelist = (id) => {
  const [isWhiteListed, setIsWhiteListed] = useState(false);
  const [switchValue, setSwitchValue] = useState(isWhiteListed);
  useEffect(() => {
    setSwitchValue(isWhiteListed);
  }, [isWhiteListed]);
  const [isWhiteListingLoading, setIsWhiteListingLoading] = useState(false);

  const { doesNetworkHaveValidServiceManagerToken, isSvm } = useHelpers();

  // get operator whitelist
  const setOpWhitelist = useCallback(async () => {
    try {
      const whiteListRes = await checkIfServiceRequiresWhitelisting(id);
      setIsWhiteListed(whiteListRes);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  // on load, get operator whitelist
  useEffect(() => {
    const getData = async () => {
      await setOpWhitelist();
    };

    if (id && doesNetworkHaveValidServiceManagerToken && !isSvm) getData();
  }, [id, setOpWhitelist, doesNetworkHaveValidServiceManagerToken, isSvm]);

  return {
    id,
    isWhiteListed,
    switchValue,
    setSwitchValue,
    isWhiteListingLoading,
    setIsWhiteListingLoading,
    setOpWhitelist,
  };
};

export const useOperatorWhitelistComponent = (id, isOwner) => {
  const { account } = useHelpers();

  const {
    isWhiteListed,
    switchValue,
    setSwitchValue,
    isWhiteListingLoading,
    setIsWhiteListingLoading,
    setOpWhitelist,
  } = useOperatorWhitelist(id);

  const operatorWhitelistTitle = (
    <>
      Operator Whitelisting&nbsp;
      <Switch
        disabled={!isOwner}
        checked={switchValue}
        checkedChildren="Enabled"
        unCheckedChildren="Disabled"
        loading={isWhiteListingLoading}
        onChange={async (checked) => {
          try {
            setIsWhiteListingLoading(true);
            await setOperatorsCheckRequest({
              account,
              serviceId: id,
              isChecked: checked,
            });
            setSwitchValue(checked);
            await setOpWhitelist();
          } catch (error) {
            console.error(error);
          } finally {
            setIsWhiteListingLoading(false);
          }
        }}
      />
    </>
  );

  const operatorWhitelistValue = (
    <OperatorWhitelist
      id={id}
      setOpWhitelist={setOpWhitelist}
      isWhiteListed={isWhiteListed}
    />
  );

  /**
   *
   * Operator Status component
   */
  const operatorStatusValue = (
    <SetOperatorStatus id={id} setOpWhitelist={setOpWhitelist} />
  );

  return {
    operatorWhitelistTitle,
    operatorWhitelistValue,
    operatorStatusValue,
  };
};
