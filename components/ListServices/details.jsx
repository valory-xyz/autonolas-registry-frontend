import { useCallback } from 'react';
import { useRouter } from 'next/router';

import Details from 'common-util/Details';
import { useHelpers } from 'common-util/hooks';

import { ServiceState } from './ServiceState';
import {
  useGetServiceDetails,
  useGetServiceOwner,
  useGetServiceTokenUri,
} from './useService';

const Service = () => {
  const router = useRouter();
  const id = router?.query?.id;

  const { links } = useHelpers();

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
