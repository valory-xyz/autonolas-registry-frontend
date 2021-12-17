import { Button, Typography } from 'antd';
import { useRouter } from 'next/router';
import { RegisterFooter } from '../styles';

const { Title } = Typography;

const RegisterComponents = () => {
  const router = useRouter();

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <>
      <Title level={2}>Register Component</Title>
      <RegisterFooter>
        <p>To register, connect to wallet</p>
        <Button onClick={handleCancel}>Cancel</Button>
      </RegisterFooter>
    </>
  );
};

export default RegisterComponents;
