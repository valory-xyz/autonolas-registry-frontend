import { Typography } from 'antd';
import { useRouter } from 'next/router';
import get from 'lodash/get';

const { Title } = Typography;

const Agent = () => {
  const router = useRouter();
  const id = get(router, 'query.id') || null;
  console.log(`agent_id = ${id}`);

  return (
    <>
      <Title level={2}>Agent</Title>
    </>
  );
};

export default Agent;
