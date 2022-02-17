import { useRouter } from 'next/router';
import get from 'lodash/get';
import { URL } from 'util/constants';
import Details from 'common-util/Details';
import { getServiceDetails } from './utils';

const Service = () => {
  const router = useRouter();
  const id = get(router, 'query.id') || null;

  return (
    <>
      <Details
        type="service"
        id={id}
        getDetails={() => getServiceDetails(id)}
        handleUpdate={() => router.push(`${URL.UPDATE_SERVICE}/${id}`)}
      />
    </>
  );
};

export default Service;
