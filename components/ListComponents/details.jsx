import { useRouter } from 'next/router';
import get from 'lodash/get';
import Details from 'common-util/Details';
import { getComponentDetails } from './utils';

const Component = () => {
  const router = useRouter();
  const id = get(router, 'query.id') || null;

  return (
    <>
      <Details
        type="component"
        id={id}
        getDetails={() => getComponentDetails(id)}
      />
    </>
  );
};

export default Component;
