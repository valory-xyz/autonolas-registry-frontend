import { Button, Typography } from 'antd/lib';
import { useRouter } from 'next/router';
import { RegisterFooter } from '../styles';

const { Title } = Typography;

const RegisterOperators = () => {
  const router = useRouter();

  const handleCancel = () => {
    router.push('/operators');
  };

  return (
    <>
      <Title level={2}>Mint Operator</Title>
      <RegisterFooter>
        <p>To mint, connect to wallet</p>
        <Button type="primary" onClick={handleCancel}>
          Cancel
        </Button>
      </RegisterFooter>
    </>
  );
};

export default RegisterOperators;
