import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button, Skeleton } from 'antd';
import PropTypes from 'prop-types';
import get from 'lodash/get';

const Container = styled.div`
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

// wait for 20 seconds before showing the error message
const TIMEOUT_IN_SECONDS = 20;

const DEFAULT_MESSAGE = 'Items couldn’t be loaded';

const Loader = ({ isAccountRequired, notConnectedMessage, timeoutMessage }) => {
  const [seconds, setSeconds] = useState(TIMEOUT_IN_SECONDS);
  const account = useSelector((state) => get(state, 'setup.account'));

  useEffect(() => {
    let interval = null;
    if (seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [seconds]);

  if (isAccountRequired && !account) {
    return (
      <Container>
        <p>{notConnectedMessage || 'Please connect your wallet'}</p>
      </Container>
    );
  }

  if (seconds === 0) {
    return (
      <Container>
        <p>{timeoutMessage || DEFAULT_MESSAGE}</p>
        <Button ghost type="primary" onClick={() => window.location.reload()}>
          Reload
        </Button>
      </Container>
    );
  }

  return <Skeleton active />;
};

Loader.propTypes = {
  isAccountRequired: PropTypes.bool,
  notConnectedMessage: PropTypes.string,
  timeoutMessage: PropTypes.string,
};

Loader.defaultProps = {
  isAccountRequired: false,
  notConnectedMessage: null,
  timeoutMessage: null,
};

export default Loader;
