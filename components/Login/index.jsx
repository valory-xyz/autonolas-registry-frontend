import { Button } from 'antd';
import { Container } from './styles';

const Login = () => {
  const openMetamask = () => {
    alert('hey');
  };

  return (
    <>
      <Container data-testid="login">
        <Button type="primary" size="large" onClick={openMetamask}>Login</Button>
      </Container>
    </>
  );
};

export default Login;
