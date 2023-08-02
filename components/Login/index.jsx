import { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useAccount, useNetwork, useBalance } from 'wagmi';
import {
  setUserAccount as setUserAccountFn,
  setUserBalance as setUserBalanceFn,
  setErrorMessage as setErrorMessageFn,
  setLogout as setLogoutFn,
} from 'store/setup/actions';
import { LoginV2 as LoginComponent } from 'common-util/Login';

const Login = ({
  setUserAccount,
  setUserBalance,
  setErrorMessage,
  setLogout,
}) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data } = useBalance({ address, chainId: chain?.id });

  useEffect(() => {
    if (address) {
      setUserAccount(address);
      setUserBalance(data?.formatted);
    } else {
      setLogout();
    }
  }, [address]);

  const onConnect = (response) => {
    setUserAccount(response.address);
    setUserBalance(response.balance);
  };

  const onDisconnect = () => {
    setLogout();
  };

  const onError = (error) => {
    setErrorMessage(error);
  };

  return (
    <div>
      <LoginComponent
        onConnect={onConnect}
        onDisconnect={onDisconnect}
        onError={onError}
      />
    </div>
  );
};

Login.propTypes = {
  setUserAccount: PropTypes.func.isRequired,
  setUserBalance: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
  setLogout: PropTypes.func.isRequired,
};

Login.defaultProps = {};

const mapDispatchToProps = {
  setUserAccount: setUserAccountFn,
  setUserBalance: setUserBalanceFn,
  setErrorMessage: setErrorMessageFn,
  setLogout: setLogoutFn,
};

export default connect(null, mapDispatchToProps)(Login);
