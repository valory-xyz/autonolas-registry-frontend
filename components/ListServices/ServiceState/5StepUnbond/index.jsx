import { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { notifyError, notifySuccess } from '@autonolas/frontend-library';

import { useHelpers } from 'common-util/hooks';
import { SendTransactionButton } from 'common-util/TransactionHelpers/SendTransactionButton';
import { useUnbond } from '../useSvmServiceStateManagement';

export const Unbond = ({
  serviceId,
  updateDetails,
  getButton,
  getOtherBtnProps,
}) => {
  const { account } = useHelpers();
  const operators = useSelector(
    (state) => state?.service?.serviceState?.agentInstancesAndOperators,
  );
  const onStep5Unbond = useUnbond();

  const [isUnbonding, setIsUnbonding] = useState(false);

  const onUnbond = async () => {
    try {
      setIsUnbonding(true);
      await onStep5Unbond(serviceId);

      await updateDetails();
      notifySuccess('Unbonded successfully');
    } catch (e) {
      console.error(e);
      notifyError('Error while unbonding, please try again');
    } finally {
      setIsUnbonding(false);
    }
  };

  /**
   * if valid operator (did in 2nd step), then enable the button
   * else the user should not be able to unbond it
   */
  const isValidOperator = (operators || []).some(
    // toString() is used to convert PublicKey to string (if it is PublicKey)
    (e) => e.agentInstance?.toLowerCase() === account?.toString().toLowerCase(),
  );

  return getButton(
    <SendTransactionButton
      onClick={onUnbond}
      loading={isUnbonding}
      {...getOtherBtnProps(5)}
    >
      Unbond
    </SendTransactionButton>,
    {
      step: 5,
      // TODO: only operator can do it (remove the true condition)
      condition: true || isValidOperator,
      message: 'Only operator can take this action',
    },
  );
};

Unbond.propTypes = {
  serviceId: PropTypes.string.isRequired,
  updateDetails: PropTypes.func.isRequired,
  getButton: PropTypes.func.isRequired,
  getOtherBtnProps: PropTypes.func.isRequired,
};

Unbond.defaultProps = {};
