import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { URL } from 'util/constants';
import Details from 'common-util/Details';
import {
  getComponentDetails,
  getComponentHashes,
  updateComponentHashes,
  getComponentOwner,
  getTokenUri,
} from './utils';

const Component = () => {
  const router = useRouter();
  const id = router?.query?.id;
  const account = useSelector((state) => state?.setup?.account);

  return (
    <Details
      type="component"
      id={id}
      getDetails={() => getComponentDetails(id)}
      getHashes={() => getComponentHashes(id)}
      getOwner={() => getComponentOwner(id)}
      getTokenUri={() => getTokenUri(id)}
      onUpdateHash={async (newHash) => {
        await updateComponentHashes(account, id, newHash);
      }}
      onDependencyClick={(e) => router.push(`${URL.COMPONENTS}/${e}`)}
    />
  );
};

export default Component;
