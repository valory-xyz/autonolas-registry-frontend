import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'antd/lib';
import get from 'lodash/get';

const Unbond = ({ handleStep5Unbond, getButton, getOtherBtnProps }) => {
  const account = useSelector((state) => get(state, 'setup.account'));
  const operators = useSelector((state) => get(state, 'service.serviceState.agentInstancesAndOperators'));

  /**
   * if valid operator (did in 2nd step), then enable the button
   * else the user should not be able to unbond it
   */
  const isValidOperator = operators.some(
    (e) => (e.agentInstance || '').toLowerCase() === (account || '').toLowerCase(),
  );

  return getButton(
    <Button
      onClick={handleStep5Unbond}
      {...getOtherBtnProps(5, { isDisabled: !isValidOperator })}
    >
      Unbond
    </Button>,
    {
      step: 5,
      condition: isValidOperator,
      message: 'Only operator can take this action',
    },
  );
};

Unbond.propTypes = {
  handleStep5Unbond: PropTypes.func.isRequired,
  getButton: PropTypes.func.isRequired,
  getOtherBtnProps: PropTypes.func.isRequired,
};

Unbond.defaultProps = {};

export default Unbond;
