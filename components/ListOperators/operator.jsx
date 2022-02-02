import { Typography } from 'antd';
import { useRouter } from 'next/router';
import get from 'lodash/get';

const { Title } = Typography;

const Operator = () => {
  const router = useRouter();
  const id = get(router, 'query.id') || null;
  console.log(`operator_id = ${id}`);

  return (
    <>
      <Title level={2}>Operator</Title>
    </>
  );
};

export default Operator;
