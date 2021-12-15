import { Button, Typography } from 'antd';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { MenuEmptyMessage } from 'common-util/MenuCommon';

const { Title } = Typography;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h2 {
    margin: 0;
  }
`;

const MenuComponents = () => {
  const router = useRouter();

  const handleRegister = () => {
    router.push('/operators/register');
  };

  return (
    <>
      <Header>
        <Title level={2}>Operators</Title>
        <Button ghost type="primary" onClick={handleRegister}>
          Register
        </Button>
      </Header>
      <MenuEmptyMessage type="operator" />
    </>
  );
};

export default MenuComponents;
