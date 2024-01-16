import { useRouter } from 'next/router';

import Details from 'common-util/Details';
import { useHelpers } from 'common-util/hooks';
import {
  useCallback,
  // useEffect, useState
} from 'react';
import {
  getServiceDetails,
  getServiceHashes,
  getServiceOwner,
  getTokenUri,
} from './utils';
import { useGetServiceDetails, useServiceOwner } from './useSvmService';

// const useServiceDetails = (serviceId) => {
//   const { isSvm } = useHelpers();
//   const { getSvmServiceDetails } = useGetServiceDetails();
//   const [details, setDetails] = useState({});

//   useEffect(() => {
//     console.log({ isSvm, serviceId });
//     const getInfo = async () => {
//       if (isSvm) {
//         const e = await getSvmServiceDetails(serviceId);
//         setDetails(e);
//       } else {
//         // const e = getServiceDetails(serviceId);
//         // setDetails(e);
//       }
//     };

//     setTimeout(() => {
//       getInfo();
//     }, 5000);
//   }, [isSvm, serviceId, getSvmServiceDetails]);

//   return {
//     ...details,
//   };
// };

const Service = () => {
  const router = useRouter();
  const id = router?.query?.id;
  const { links, isSvm } = useHelpers();
  const { getSvmServiceDetails } = useGetServiceDetails();
  const { getSvmServiceOwner } = useServiceOwner();

  const getDetails = useCallback(
    async () => {
      const e = isSvm
        ? await getSvmServiceDetails(id)
        : await getServiceDetails(id);
      return e;
    },
    [id, isSvm, getSvmServiceDetails],
  );

  const getOwner = useCallback(async () => {
    const e = isSvm
      ? await getSvmServiceOwner(id)
      : await getServiceDetails(id);
    return e;
  }, [id, isSvm, getSvmServiceOwner]);

  return (
    <Details
      type="service"
      id={id}
      getDetails={getDetails}
      getHashes={() => getServiceHashes(id)}
      getOwner={getOwner}
      getTokenUri={() => getTokenUri(id)}
      handleUpdate={() => router.push(`${links.UPDATE_SERVICE}/${id}`)}
      onDependencyClick={(e) => router.push(`${links.AGENTS}/${e}`)}
    />
  );
};

export default Service;
