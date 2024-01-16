import { useRouter } from 'next/router';

import Details from 'common-util/Details';
import { useHelpers } from 'common-util/hooks';
import {
  getComponentDetails,
  updateComponentHashes,
  getComponentOwner,
  getTokenUri,
} from './utils';

const Component = () => {
  const router = useRouter();
  const id = router?.query?.id;
  const { account, links } = useHelpers();

  return (
    <Details
      type="component"
      id={id}
      getDetails={() => getComponentDetails(id)}
      getOwner={() => getComponentOwner(id)}
      getTokenUri={() => getTokenUri(id)}
      onUpdateHash={async (newHash) => {
        await updateComponentHashes(account, id, newHash);
      }}
      onDependencyClick={(e) => router.push(`${links.COMPONENTS}/${e}`)}
    />
  );
};

export default Component;
