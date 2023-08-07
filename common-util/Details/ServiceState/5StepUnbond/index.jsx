import { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'antd/lib';
import get from 'lodash/get';
import { onStep5Unbond } from '../utils';

const Unbond = ({
  id, updateDetails, getButton, getOtherBtnProps,
}) => {
  const account = useSelector((state) => get(state, 'setup.account'));
  const operators = useSelector((state) => get(state, 'service.serviceState.agentInstancesAndOperators'));
  const [isUnbonding, setIsUnbonding] = useState(false);

  const onUnbond = async () => {
    try {
      setIsUnbonding(true);
      await onStep5Unbond(account, id);
      await updateDetails();
    } catch (e) {
      console.error(e);
    } finally {
      setIsUnbonding(false);
    }
  };

  /**
   * if valid operator (did in 2nd step), then enable the button
   * else the user should not be able to unbond it
   */
  const isValidOperator = (operators || []).some(
    (e) => (e.agentInstance || '').toLowerCase() === (account || '').toLowerCase(),
  );

  return getButton(
    <Button onClick={onUnbond} loading={isUnbonding} {...getOtherBtnProps(5)}>
      Unbond
    </Button>,
    {
      step: 5,
      // TODO: only operator can do it (remove the true condition)
      condition: true || isValidOperator,
      message: 'Only operator can take this action',
    },
  );
};

Unbond.propTypes = {
  id: PropTypes.string.isRequired,
  updateDetails: PropTypes.func.isRequired,
  getButton: PropTypes.func.isRequired,
  getOtherBtnProps: PropTypes.func.isRequired,
};

Unbond.defaultProps = {};

export default Unbond;
