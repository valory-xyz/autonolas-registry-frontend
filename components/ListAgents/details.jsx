import { useRouter } from 'next/router';
import get from 'lodash/get';
import Details from 'common-util/Details';
import { getAgentDetails } from './utils';

const Agent = () => {
  const router = useRouter();
  const id = get(router, 'query.id') || null;

  return (
    <>
      <Details type="agent" id={id} getDetails={() => getAgentDetails(id)} />
    </>
  );
};

export default Agent;
