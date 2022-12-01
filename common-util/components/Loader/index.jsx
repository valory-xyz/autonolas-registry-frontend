import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Button, Skeleton } from 'antd/lib';

const Container = styled.div`
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const TIMEOUT = 10;

const DEFAULT_MESSAGE = 'Items couldn’t be loaded';

const Loader = ({ isAccountRequired, message }) => {
  const [seconds, setSeconds] = useState(TIMEOUT);
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
        <p>{message || DEFAULT_MESSAGE}</p>
      </Container>
    );
  }

  if (seconds === 0) {
    return (
      <Container>
        <p>{message || DEFAULT_MESSAGE}</p>
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
  message: PropTypes.string,
};

Loader.defaultProps = {
  isAccountRequired: false,
  message: '',
};

export default Loader;
