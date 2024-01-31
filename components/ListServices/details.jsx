import { useCallback } from 'react';
import { useRouter } from 'next/router';

import Details from 'common-util/Details';
import { useHelpers } from 'common-util/hooks';
import { useSvmConnectivity } from 'common-util/hooks/useSvmConnectivity';

import { ServiceState } from './ServiceState';
import { EmptyMessage } from '../styles';
import {
  useGetServiceDetails,
  useGetServiceOwner,
  useGetServiceTokenUri,
} from './useService';

const Service = () => {
  const router = useRouter();
  const id = router?.query?.id;
  const { links } = useHelpers();
  const { hasNoSvmPublicKey } = useSvmConnectivity();

  const getDetails = useGetServiceDetails();
  const getOwner = useGetServiceOwner();
  const getTokenUri = useGetServiceTokenUri();

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
