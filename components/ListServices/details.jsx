import { useCallback } from 'react';
import { useRouter } from 'next/router';

import Details from 'common-util/Details';
import { useHelpers } from 'common-util/hooks';
import { useSvmConnectivity } from 'common-util/hooks/useSvmConnectivity';

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
import { ServiceState } from './ServiceState';
import { EmptyMessage } from '../styles';

const Service = () => {
  const router = useRouter();
  const id = router?.query?.id;
  const { links, isSvm } = useHelpers();
  const { hasNoSvmPublicKey } = useSvmConnectivity();
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

  const handleUpdate = useCallback(() => {
    router.push(`${links.UPDATE_SERVICE}/${id}`);
  }, [id, router, links]);

  const navigateToDependency = useCallback(
    (e) => {
      router.push(`${links.AGENTS}/${e}`);
    },
    [router, links],
  );

  if (hasNoSvmPublicKey) {
    return (
      <EmptyMessage>
        To view this page, connect a wallet that holds SOL
      </EmptyMessage>
    );
  }

  return (
    <Details
      type="service"
      id={id}
      getDetails={getDetails}
      getOwner={getOwner}
      getTokenUri={getTokenUri}
      handleUpdate={handleUpdate}
      navigateToDependency={navigateToDependency}
      renderServiceState={({ isOwner, details, updateDetails }) => (
        <ServiceState
          isOwner={isOwner}
          id={id}
          details={details}
          updateDetails={updateDetails}
        />
      )}
    />
  );
};

export default Service;
