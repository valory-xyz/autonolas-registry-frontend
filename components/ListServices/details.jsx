import { useRouter } from 'next/router';

import Details from 'common-util/Details';
import { useHelpers } from 'common-util/hooks';
import {
  getServiceDetails,
  getServiceHashes,
  getServiceOwner,
  getTokenUri,
} from './utils';

const Service = () => {
  const router = useRouter();
  const id = router?.query?.id;
  const { links } = useHelpers();

  return (
    <Details
      type="service"
      id={id}
      getDetails={() => getServiceDetails(id)}
      getHashes={() => getServiceHashes(id)}
      getOwner={() => getServiceOwner(id)}
      getTokenUri={() => getTokenUri(id)}
      handleUpdate={() => router.push(`${links.UPDATE_SERVICE}/${id}`)}
      onDependencyClick={(e) => router.push(`${links.AGENTS}/${e}`)}
    />
  );
};

export default Service;
