import { Button } from 'antd';
import { isFunction } from 'lodash';
import PropTypes from 'prop-types';
import { useHelpers } from '../hooks';
import { notifyWrongNetwork } from '../functions';

/**
 * @param {import('antd').ButtonProps}
 * @returns {Button}
 */
export const SendTransactionButton = ({ onClick, children, ...rest }) => {
  const { isConnectedToWrongNetwork } = useHelpers();

  // if connected to wrong network, then switch network else call onClick
  const handleClick = async (e) => {
    if (isConnectedToWrongNetwork) {
      notifyWrongNetwork();
    } else if (isFunction(onClick)) {
      onClick(e);
    }
  };

  return (
    <Button {...rest} onClick={handleClick}>
      {children}
    </Button>
  );
};

SendTransactionButton.propTypes = {
  loading: PropTypes.bool,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

SendTransactionButton.defaultProps = {
  loading: false,
  children: null,
  onClick: null,
};
