import { useRouter } from 'next/router';
import get from 'lodash/get';
import { URL } from 'util/constants';
import Details from 'common-util/Details';
import {
  getServiceDetails, getServiceHashes, getServiceOwner, getTokenUri,
} from './utils';

const Service = () => {
  const router = useRouter();
  const id = get(router, 'query.id') || null;

  return (
    <Details
      type="service"
      id={id}
      getDetails={() => getServiceDetails(id)}
      getHashes={() => getServiceHashes(id)}
      getOwner={() => getServiceOwner(id)}
      getTokenUri={() => getTokenUri(id)}
      handleUpdate={() => router.push(`${URL.UPDATE_SERVICE}/${id}`)}
      onDependencyClick={(e) => router.push(`${URL.AGENTS}/${e}`)}
    />
  );
};

export default Service;
