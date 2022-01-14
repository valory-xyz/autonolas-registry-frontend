import { Button, Typography } from 'antd';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { ListEmptyMessage } from 'common-util/ListCommon';

const { Title } = Typography;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h2 {
    margin: 0;
  }
`;

const ListOperators = () => {
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
      <ListEmptyMessage type="operator" />
    </>
  );
};

export default ListOperators;
