import { useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Space } from 'antd';
import {
  isLocalNetwork,
  notifyError,
  notifySuccess,
} from '@autonolas/frontend-library';

import { useHelpers } from 'common-util/hooks';
import { SendTransactionButton } from 'common-util/TransactionHelpers/SendTransactionButton';
import { checkAndApproveToken, mintTokenRequest } from '../utils';
import { useGetActivateRegistration } from '../useSvmServiceStateManagement';

export const PreRegistration = ({
  serviceId,
  isOwner,
  securityDeposit,
  isEthToken,
  getOtherBtnProps,
  getButton,
  updateDetails,
}) => {
  const router = useRouter();
  const {
    account, chainId, links, isSvm,
  } = useHelpers();
  const [isActivating, setIsActivating] = useState(false);
  const onActivateRegistration = useGetActivateRegistration();

  const handleStep1Registration = async () => {
    try {
      setIsActivating(true);
      // if not eth, check if the user has sufficient token balance
      // and if not, approve the token
      if (!isEthToken && !isSvm) {
        await checkAndApproveToken({
          account,
          chainId,
          serviceId,
        });
      }

      // NOTE: just for testing, mint tokens for local network
      if (isLocalNetwork(chainId)) {
        // mint tokens before activating registration
        await mintTokenRequest({ account, serviceId });
      }

      // any amount if not ETH token substitute with 1
      await onActivateRegistration(
        serviceId,
        account,
        isEthToken ? securityDeposit : '1',
      );
      await updateDetails();

      notifySuccess('Activated successfully');
    } catch (e) {
      console.error(e);
      notifyError('Error while activating registration, please try again');
    } finally {
      setIsActivating(false);
    }
  };

  const handleStep1Update = () => {
    router.push(`${links.UPDATE_SERVICE}/${serviceId}`);
  };

  return (
    <div className="step-1-pre-registration">
      <Space>
        {getButton(
          <SendTransactionButton
            onClick={handleStep1Registration}
            loading={isActivating}
            {...getOtherBtnProps(1, { isDisabled: !isOwner })}
          >
            Activate Registration
          </SendTransactionButton>,
          { step: 1 },
        )}
        {getButton(
          <SendTransactionButton
            onClick={handleStep1Update}
            {...getOtherBtnProps(1, { isDisabled: !isOwner })}
          >
            Update
          </SendTransactionButton>,
          { step: 1 },
        )}
      </Space>
    </div>
  );
};

PreRegistration.propTypes = {
  serviceId: PropTypes.string,
  getOtherBtnProps: PropTypes.func.isRequired,
  getButton: PropTypes.func.isRequired,
  isOwner: PropTypes.bool.isRequired,
  isEthToken: PropTypes.bool.isRequired,
  securityDeposit: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  updateDetails: PropTypes.func.isRequired,
};

PreRegistration.defaultProps = {
  serviceId: null,
  securityDeposit: '0',
};
