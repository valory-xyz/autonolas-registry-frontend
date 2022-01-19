import { Typography } from 'antd';
import { useRouter } from 'next/router';

const { Title } = Typography;

const Agent = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log(`agent_id = ${id}`);

  return (
    <>
      <Title level={2}>Agent</Title>
    </>
  );
};

export default Agent;
