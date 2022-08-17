import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Skeleton } from 'antd';

const Container = styled.div`
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const TIMEOUT = 10;

const Loader = () => {
  const [seconds, setSeconds] = useState(TIMEOUT);

  useEffect(() => {
    let interval = null;
    if (seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [seconds]);

  if (seconds === 0) {
    return (
      <Container>
        <p>Items couldn’t be loaded</p>
        <Button ghost type="primary" onClick={() => window.location.reload()}>
          Reload
        </Button>
      </Container>
    );
  }

  return <Skeleton active />;
};

export default Loader;
