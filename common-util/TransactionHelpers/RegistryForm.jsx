/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import { isFunction } from 'lodash';
import { useHelpers } from '../hooks';
import { notifyWrongNetwork } from '../functions';

/**
 * @param {import('antd').FormProps}
 * @returns {Form} Custom form component that checks
 * if the network is connected to the correct network
 */
export const RegistryForm = ({ onFinish, children, ...rest }) => {
  const { isConnectedToWrongNetwork } = useHelpers();

  const handleFinish = useCallback(
    async (...params) => {
      if (isConnectedToWrongNetwork) {
        notifyWrongNetwork();
      } else if (isFunction(onFinish)) {
        onFinish(...params);
      }
    },
    [isConnectedToWrongNetwork],
  );

  return (
    <Form {...rest} onFinish={handleFinish}>
      {children}
    </Form>
  );
};

RegistryForm.defaultProps = {
  onFinish: null,
  children: null,
};

RegistryForm.propTypes = {
  onFinish: PropTypes.func,
  children: PropTypes.node,
};
