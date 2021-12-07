import React, { useState, useEffect } from 'react';
import { Button, Typography, Alert } from 'antd';
import { ethers } from 'ethers';
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
        method: 'eth_getBalance',
        params: [accoundPassed, 'latest'],
      })
      .then((b) => {
        setUserBalance(b);
        setUserBalance(ethers.utils.formatEther(balance));
      })
      .catch((e) => {
        setErrorMessage(e.message);
      });
  };

  const handleLogin = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((result) => {
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

  console.log(account);
  if (account) {
    return (
      <Container>
        <DetailsContainer>
          <Title level={4}>
            Address:&nbsp;
            {account ? `${account}` : 'NA'}
          </Title>
          <Title>
            Balance:&nbsp;
            {balance ? `${balance} ETH` : 'NA'}
          </Title>

          <Button type="danger" size="large" onClick={handleMetamaskLogout}>
            Disconnect
          </Button>

          <br />
          {errorMessage && (
            <Alert
              message="Error"
              description={errorMessage}
              type="error"
              showIcon
            />
          )}
        </DetailsContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Button type="primary" size="large" onClick={handleLogin}>
        Connect to wallet!
      </Button>
    </Container>
  );
};

export default MetamaskProvider;
