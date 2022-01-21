import { Typography } from 'antd';
import { useRouter } from 'next/router';
import get from 'lodash/get';

const { Title } = Typography;

const Component = () => {
  const router = useRouter();
  const id = get(router, 'query.id') || null;
  console.log(`component_id = ${id}`);

  return (
    <>
      <Title level={2}>Component</Title>
    </>
  );
};

export default Component;
