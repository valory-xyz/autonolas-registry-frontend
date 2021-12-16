import { Typography } from 'antd';
import { useRouter } from 'next/router';

const { Title } = Typography;

const Component = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log(`component_id = ${id}`);

  return (
    <>
      <Title level={2}>Component</Title>
    </>
  );
};

export default Component;
