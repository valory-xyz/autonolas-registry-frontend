import React, { useState, useEffect } from 'react';
import { Button, Typography, Alert } from 'antd';
import { ethers } from 'ethers';
import { CONSTANTS } from 'util/constants';
import { Container, DetailsContainer } from './styles';

const { Title } = Typography;

const MetamaskProvider = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setUserBalance] = useState(null);

  /**
   * helpers to check if metamask is present
   */
  useEffect(() => {}, []);

  const getBalance = (accoundPassed) => {
    window.ethereum
      .request({
        method: CONSTANTS.ETH_GETBALANCE,
        params: [accoundPassed, 'latest'],
      })
      .then((b) => {
        setUserBalance(ethers.utils.formatEther(b));
      })
      .catch((e) => {
        setErrorMessage(e.message);
      });
  };

  const handleLogin = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: CONSTANTS.ETH_REQUESTACCOUNTS })
        .then((result) => {
          // setting only the 1st account
          setAccount(result[0]);
          getBalance(result[0]);
        })
        .catch((e) => {
          setErrorMessage(e.message);
        });
    } else {
      setErrorMessage('Please install MetaMask browser extension');
    }
  };

  const handleMetamaskLogout = async () => {};

  /**
   * listener for account, chain changes
   */
  const handleAccountChange = (newAccount) => {
    setAccount(newAccount);
    getBalance(newAccount.toString());
  };

  // reload the page to on chain change to avoid errors
  const handleChainChange = () => {
    window.location.reload();
  };

  if (typeof window !== 'undefined') {
    window.ethereum.on('accountsChanged', handleAccountChange);
    window.ethereum.on('chainChanged', handleChainChange);
  }

  if (account) {
    return (
      <Container>
        <DetailsContainer>
          {errorMessage ? (
            <Alert message={errorMessage} type="error" showIcon />
          ) : (
            <Alert
              message={(
                <Title level={5}>
                  Address:&nbsp;
                  {account ? `${account}` : 'NA'}
                </Title>
              )}
              type="success"
              showIcon
            />
          )}
        </DetailsContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Button
        type="primary"
        // size="large"
        onClick={handleLogin}
      >
        Connect Wallet
      </Button>
    </Container>
  );
};

export default MetamaskProvider;
