import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { URL } from 'util/constants';
import Details from 'common-util/Details';
import {
  getAgentDetails,
  getAgentHashes,
  updateAgentHashes,
  getAgentOwner,
  getTokenUri,
} from './utils';

const Agent = ({ account }) => {
  const router = useRouter();
  const id = get(router, 'query.id') || null;

  return (
    <>
      <Details
        type="agent"
        id={id}
        getDetails={() => getAgentDetails(id)}
        getHashes={() => getAgentHashes(id)}
        getTokenUri={() => getTokenUri(id)}
        getOwner={() => getAgentOwner(id)}
        onUpdateHash={(newHash) => updateAgentHashes(account, id, newHash)}
        onDependencyClick={(e) => router.push(`${URL.AGENTS}/${e}`)}
      />
    </>
  );
};

Agent.propTypes = {
  account: PropTypes.string,
};

Agent.defaultProps = {
  account: null,
};

const mapStateToProps = (state) => {
  const account = get(state, 'setup.account') || null;
  return { account };
};

export default connect(mapStateToProps, {})(Agent);
