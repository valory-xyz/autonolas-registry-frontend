import { useRouter } from 'next/router';
import get from 'lodash/get';
import { URL } from 'util/constants';
import Details from 'common-util/Details';
import { getAgentDetails, getAgentHashes } from './utils';

const Agent = () => {
  const router = useRouter();
  const id = get(router, 'query.id') || null;

  return (
    <>
      <Details
        type="agent"
        id={id}
        getDetails={() => getAgentDetails(id)}
        getHashes={() => getAgentHashes(id)}
        onDependencyClick={(e) => router.push(`${URL.AGENTS}/${e}`)}
      />
    </>
  );
};

export default Agent;
