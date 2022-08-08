import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { setLoaded as setLoadedFn } from 'store/setup/actions';
import { CONSTANTS } from 'util/constants';
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
    /**
     * If metamask was activated before, IS_CONNECTED localStorage will be set to true.
     * If disconnected (loggout/disconnect button is clicked), IS_CONNECTED will be set to false,
     * so we need to show popup only if metamask was connected before and the user
     * did not disconnect.
     */
    const wasConnected = localStorage.getItem(CONSTANTS.IS_CONNECTED);
    if (!!wasConnected && wasConnected === 'true') {
      injected
        .isAuthorized()
        .then((hasAuthorized) => {
          if (hasAuthorized && !networkActive && !networkError) {
            setLoaded(true);
            activateNetwork(injected);
          }
        })
        .catch(() => {
          setLoaded(false);
        });
    }
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
