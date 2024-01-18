import { useCallback } from 'react';
import { useRouter } from 'next/router';

import Details from 'common-util/Details';
import { useHelpers } from 'common-util/hooks';
import { useSvmConnectivity } from 'common-util/hooks/useSvmConnectivity';

import { getServiceOwner, getTokenUri as getEvmTokenUri } from './utils';
import { useServiceOwner, useTokenUri } from './useSvmService';
import { ServiceState } from './ServiceState';
import { EmptyMessage } from '../styles';
import { useGetServiceDetails } from './useService';

const Service = () => {
  const router = useRouter();
  const id = router?.query?.id;
  const { links, isSvm } = useHelpers();
  const { hasNoSvmPublicKey } = useSvmConnectivity();
  const { getSvmServiceOwner } = useServiceOwner();
  const { getSvmTokenUri } = useTokenUri();

  const getDetails = useGetServiceDetails();

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
