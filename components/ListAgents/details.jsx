import { useRouter } from 'next/router';

import Details from 'common-util/Details';
import { useHelpers } from 'common-util/hooks';
import { useCallback } from 'react';
import {
  getAgentDetails,
  updateAgentHashes,
  getAgentOwner,
  getTokenUri as getAgentTokenUri,
} from './utils';

const Agent = () => {
  const router = useRouter();
  const id = router?.query?.id;
  const { account, links } = useHelpers();

  const getDetails = useCallback(async () => getAgentDetails(id), [id]);
  const getOwner = useCallback(async () => getAgentOwner(id), [id]);
  const getTokenUri = useCallback(async () => getAgentTokenUri(id), [id]);
  const onUpdateHash = useCallback(
    async (newHash) => {
      await updateAgentHashes(account, id, newHash);
    },
    [account, id],
  );

  return (
    <Details
      type="agent"
      id={id}
      getDetails={getDetails}
      getOwner={getOwner}
      getTokenUri={getTokenUri}
      handleHashUpdate={onUpdateHash}
      navigateToDependency={(e) => router.push(`${links.COMPONENTS}/${e}`)}
    />
  );
};

export default Agent;
