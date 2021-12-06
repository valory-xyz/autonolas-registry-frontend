import React, { useCallback, useState } from 'react';
import { Button, Typography } from 'antd';

import { useWeb3React } from '@web3-react/core';
import { injected } from './wallet/connector';
import { Container } from './styles';

const { Title } = Typography;

const MetamaskProvider = () => {
  const {
    active: networkActive,
    error: networkError,
    activate: activateNetwork,
    deactivate: deactivateNetwork,
    account,
  } = useWeb3React();
  const [loaded, setLoaded] = useState(false);

  const loginCallback = useCallback(() => {
    injected
      .isAuthorized()
      .then((isAuthorized) => {
        setLoaded(true);
        if (isAuthorized && !networkActive && !networkError) {
          activateNetwork(injected);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoaded(true);
      });
  }, [activateNetwork, networkActive, networkError]);

  const handleMetamaskLogin = async () => {
    loginCallback();
  };

  const handleMetamaskLogout = async () => {
    setLoaded(false);
    try {
      deactivateNetwork();
    } catch (error) {
      console.error(error);
    }
  };

  console.log({
    networkActive,
    networkError,
    account,
  });

  if (loaded) {
    return (
      <Container>
        <div>
          <Title level={4}>
            Address:&nbsp;
            {account ? `${account}` : 'NA'}
          </Title>
          <Title>
            {/* Balance:&nbsp; */}
            {/* {balance ? `${balance} ETH` : "NA"} */}
          </Title>

          <Button type="danger" size="large" onClick={handleMetamaskLogout}>
            Disconnect
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Button type="primary" size="large" onClick={handleMetamaskLogin}>
        Connect to wallet!
      </Button>
    </Container>
  );
};

export default MetamaskProvider;
