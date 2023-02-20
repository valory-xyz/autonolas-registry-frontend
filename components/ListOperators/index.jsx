import { Button, Typography } from 'antd/lib';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { URL } from 'util/constants';
import { ListEmptyMessage } from 'common-util/List/ListCommon';

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

  return (
    <>
      <Header>
        <Title level={2}>Operators</Title>
        <Button
          ghost
          type="primary"
          onClick={() => router.push(URL.REGISTER_OPERATOR)}
        >
          Register
        </Button>
      </Header>
      <ListEmptyMessage type="operator" />
    </>
  );
};

export default ListOperators;
