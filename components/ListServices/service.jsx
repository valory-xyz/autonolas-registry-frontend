import { Typography } from 'antd';
import { useRouter } from 'next/router';
import get from 'lodash/get';
import Details from 'common-util/Details';
import { getServiceDetails } from './utils';

const { Title } = Typography;

const Agent = () => {
  const router = useRouter();
  const id = get(router, 'query.id') || null;

  return (
    <>
      <Title level={2}>
        Service&nbsp;
        {id}
      </Title>
      <Details type="service" getDetails={() => getServiceDetails(id)} />
    </>
  );
};

export default Agent;
