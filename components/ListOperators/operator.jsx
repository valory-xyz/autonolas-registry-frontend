import { Typography } from 'antd';
import { useRouter } from 'next/router';

const { Title } = Typography;

const Operator = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log(`operator_id = ${id}`);

  return (
    <>
      <Title level={2}>Operator</Title>
    </>
  );
};

export default Operator;
