import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { setLoaded as setLoadedFn } from 'store/setup/actions';
import injected from '.';

/**
 * component to persist the metamask login on browser refresh
 */
function MetamaskProvider({ setLoaded, children }) {
  const {
    active: networkActive,
    error: networkError,
    activate: activateNetwork,
  } = useWeb3React();

  useEffect(() => {
    injected
      .isAuthorized()
      .then((hasAuthorized) => {
        setLoaded(true);

        if (hasAuthorized && !networkActive && !networkError) {
          activateNetwork(injected);
        }
      })
      .catch(() => {
        setLoaded(true);
      });
  }, [activateNetwork, networkActive, networkError]);

  return children;
}

MetamaskProvider.propTypes = {
  setLoaded: PropTypes.func,
};

MetamaskProvider.defaultProps = {
  setLoaded: () => {},
};

const mapStateToProps = () => ({});
const mapDispatchToProps = { setLoaded: setLoadedFn };

export default connect(mapStateToProps, mapDispatchToProps)(MetamaskProvider);
