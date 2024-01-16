import { useRouter } from 'next/router';

import Details from 'common-util/Details';
import { useHelpers } from 'common-util/hooks';
import {
  useCallback,
  // useEffect, useState
} from 'react';
import {
  getServiceDetails,
  getServiceOwner,
  getTokenUri as getEvmTokenUri,
} from './utils';
import {
  useGetServiceDetails,
  useServiceOwner,
  useTokenUri,
} from './useSvmService';

const Service = () => {
  const router = useRouter();
  const id = router?.query?.id;
  const { links, isSvm } = useHelpers();
  const { getSvmServiceDetails } = useGetServiceDetails();
  const { getSvmServiceOwner } = useServiceOwner();
  const { getSvmTokenUri } = useTokenUri();

  const getDetails = useCallback(async () => {
    const e = isSvm
      ? await getSvmServiceDetails(id)
      : await getServiceDetails(id);
    return e;
  }, [id, isSvm, getSvmServiceDetails]);

  const getOwner = useCallback(async () => {
    const e = isSvm ? await getSvmServiceOwner(id) : await getServiceOwner(id);
    return e;
  }, [id, isSvm, getSvmServiceOwner]);

  const getTokenUri = useCallback(async () => {
    const e = isSvm ? await getSvmTokenUri(id) : await getEvmTokenUri(id);
    return e;
  }, [id, isSvm, getSvmTokenUri]);

  return (
    <Details
      type="service"
      id={id}
      getDetails={getDetails}
      getOwner={getOwner}
      getTokenUri={() => getTokenUri(id)}
      handleUpdate={() => router.push(`${links.UPDATE_SERVICE}/${id}`)}
      onDependencyClick={(e) => router.push(`${links.AGENTS}/${e}`)}
    />
  );
};

export default Service;
