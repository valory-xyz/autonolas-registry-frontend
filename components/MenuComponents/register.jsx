import { Button, Typography } from 'antd';
import { RegisterFooter } from '../styles';

const { Title } = Typography;

const RegisterComponents = () => {
  const handleCancel = () => {
    console.log('Cancel');
  };

  return (
    <>
      <Title level={2}>Register Components</Title>
      <RegisterFooter>
        <p>To register, connect to wallet</p>
        <Button onClick={handleCancel}>Cancel</Button>
      </RegisterFooter>
    </>
  );
};

export default RegisterComponents;
