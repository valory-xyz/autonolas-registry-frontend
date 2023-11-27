import { useCallback } from 'react';
import { Button, notification } from 'antd';
import { isFunction } from 'lodash';
import PropTypes from 'prop-types';
import { useSwitchNetwork } from 'wagmi';
import { useHelpers } from './hooks';

/**
 * @param {import('antd').ButtonProps}
 * @returns {Button}
 */
export const SendTransaction = ({
  loading, onClick, children, ...rest
}) => {
  const { isConnectedToWrongNetwork, chainId } = useHelpers();
  const { switchNetworkAsync, isLoading: isSwitchNetworkLoading } = useSwitchNetwork();

  // if connected to wrong network, then switch network else call onClick
  const handleClick = useCallback(async () => {
    if (isConnectedToWrongNetwork) {
      notification.warning({
        message: 'Please switch to the correct network and try again',
      });
      await switchNetworkAsync(chainId);
      onClick();
    } else if (isFunction(onClick)) {
      onClick();
    }
  }, [isConnectedToWrongNetwork]);

  return (
    <Button
      loading={loading || isSwitchNetworkLoading}
      onClick={handleClick}
      {...rest}
    >
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
