import { useRouter } from 'next/router';

import Details from 'common-util/Details';
import { useHelpers } from 'common-util/hooks';
import { useCallback } from 'react';
import {
  getComponentDetails,
  updateComponentHashes,
  getComponentOwner,
  getTokenUri as getComponentTokenUri,
} from './utils';

const Component = () => {
  const router = useRouter();
  const id = router?.query?.id;
  const { account, links } = useHelpers();

  const getDetails = useCallback(async () => getComponentDetails(id), [id]);
  const getOwner = useCallback(async () => getComponentOwner(id), [id]);
  const getTokenUri = useCallback(async () => getComponentTokenUri(id), [id]);
  const onUpdateHash = useCallback(
    async (newHash) => {
      await updateComponentHashes(account, id, newHash);
    },
    [account, id],
  );

  return (
    <Details
      type="component"
      id={id}
      getDetails={getDetails}
      getOwner={getOwner}
      getTokenUri={getTokenUri}
      onUpdateHash={onUpdateHash}
      onDependencyClick={(e) => router.push(`${links.COMPONENTS}/${e}`)}
    />
  );
};

export default Component;
