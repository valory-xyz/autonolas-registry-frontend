import { Typography } from 'antd';
import { useRouter } from 'next/router';
import get from 'lodash/get';

const { Title } = Typography;

const Service = () => {
  const router = useRouter();
  const id = get(router, 'query.id') || null;
  console.log(`service_id = ${id}`);

  return (
    <>
      <Title level={2}>Service</Title>
    </>
  );
};

export default Service;
