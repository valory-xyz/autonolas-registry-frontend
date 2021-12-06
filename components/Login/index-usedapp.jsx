import { Button, Typography } from 'antd';
import { useEthers, useEtherBalance } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';
import { Container } from './styles';

const { Title } = Typography;

const Login = () => {
  const { activateBrowserWallet, account, deactivate } = useEthers();
  const balance = useEtherBalance(account);

  const handleMetamaskLogin = () => {
    activateBrowserWallet();
  };

  const handleMetamaskLogout = () => {
    deactivate();
  };

  console.log(balance, account);

  return (
    <>
      <Container data-testid="login">
        {account ? (
          <div>
            <Title level={4}>
              Address:&nbsp;
              {account ? `${account}` : 'NA'}
            </Title>
            <Title>
              Balance:&nbsp;
              {balance ? `${formatEther(balance)} ETH` : 'NA'}
            </Title>

            <Button type="danger" size="large" onClick={handleMetamaskLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <Button type="primary" size="large" onClick={handleMetamaskLogin}>
            Connect to wallet!
          </Button>
        )}
      </Container>
    </>
  );
};

export default Login;

/**
 * account trim: xxxx${account.slice(account.length - 6, account.length)}
 *
 */
