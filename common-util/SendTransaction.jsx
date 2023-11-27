import { useCallback } from 'react';
import { Button, notification } from 'antd';
import { isFunction } from 'lodash';
import PropTypes from 'prop-types';
import { useHelpers } from './hooks';

/**
 * @param {import('antd').ButtonProps}
 * @returns {Button}
 */
export const SendTransaction = ({ onClick, children, ...rest }) => {
  const { isConnectedToWrongNetwork } = useHelpers();

  // if connected to wrong network, then switch network else call onClick
  const handleClick = useCallback(async () => {
    if (isConnectedToWrongNetwork) {
      notification.warning({
        message: 'Please switch to the correct network and try again',
      });
    } else if (isFunction(onClick)) {
      onClick();
    }
  }, [isConnectedToWrongNetwork]);

  return (
    <Button onClick={handleClick} {...rest}>
      {children}
    </Button>
  );
};

SendTransaction.propTypes = {
  loading: PropTypes.bool,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

SendTransaction.defaultProps = {
  loading: false,
  children: null,
  onClick: null,
};
