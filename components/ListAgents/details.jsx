import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { URL } from 'util/constants';
import Details from 'common-util/Details';
import {
  getAgentDetails,
  getAgentHashes,
  updateAgentHashes,
  getAgentOwner,
  getTokenUri,
} from './utils';

const Agent = () => {
  const router = useRouter();
  const id = router?.query?.id;
  const account = useSelector((state) => state?.setup?.account);

  return (
    <Details
      type="agent"
      id={id}
      getDetails={() => getAgentDetails(id)}
      getHashes={() => getAgentHashes(id)}
      getTokenUri={() => getTokenUri(id)}
      getOwner={() => getAgentOwner(id)}
      onUpdateHash={async (newHash) => {
        await updateAgentHashes(account, id, newHash);
      }}
      onDependencyClick={(e) => router.push(`${URL.COMPONENTS}/${e}`)}
    />
  );
};

export default Agent;
