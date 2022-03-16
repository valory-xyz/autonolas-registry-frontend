import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { URL } from 'util/constants';
import Details from 'common-util/Details';
import {
  getComponentDetails,
  getComponentHashes,
  updateComponentHashes,
  getComponentOwner,
} from './utils';

const Component = ({ account }) => {
  const router = useRouter();
  const id = get(router, 'query.id') || null;

  return (
    <>
      <Details
        type="component"
        id={id}
        getDetails={() => getComponentDetails(id)}
        getHashes={() => getComponentHashes(id)}
        getOwner={() => getComponentOwner(id)}
        onUpdateHash={(newHash) => updateComponentHashes(account, id, newHash)}
        onDependencyClick={(e) => router.push(`${URL.COMPONENTS}/${e}`)}
      />
    </>
  );
};

Component.propTypes = {
  account: PropTypes.string,
};

Component.defaultProps = {
  account: null,
};

const mapStateToProps = (state) => {
  const account = get(state, 'setup.account') || null;
  return { account };
};

export default connect(mapStateToProps, {})(Component);
