import { useRouter } from 'next/router';
import get from 'lodash/get';
import { URL } from 'util/constants';
import Details from 'common-util/Details';
import { getComponentDetails, getComponentHashes } from './utils';

const Component = () => {
  const router = useRouter();
  const id = get(router, 'query.id') || null;

  return (
    <>
      <Details
        type="component"
        id={id}
        getDetails={() => getComponentDetails(id)}
        getHashes={() => getComponentHashes(id)}
        onDependencyClick={(e) => router.push(`${URL.COMPONENTS}/${e}`)}
      />
    </>
  );
};

export default Component;
