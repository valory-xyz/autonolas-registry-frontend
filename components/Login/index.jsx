import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAccount, useNetwork, useBalance } from 'wagmi';
import {
  setUserAccount,
  setUserBalance,
  setErrorMessage,
  setChainId,
  setLogout,
} from 'store/setup/actions';
import { LoginV2 } from 'common-util/Login';

const Login = () => {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data } = useBalance({ address, chainId: chain?.id });

  useEffect(() => {
    if (address) {
      dispatch(setUserAccount(address));
      dispatch(setUserBalance(data?.formatted));
    } else {
      dispatch(setLogout());
    }
  }, [address]);

  useEffect(() => {
    if (chain?.id) {
      dispatch(setChainId(chain.id));
    }
  }, [chain?.id]);

  const onConnect = (response) => {
    dispatch(setUserAccount(response.address));
    dispatch(setUserBalance(response.balance));
  };

  const onDisconnect = () => {
    dispatch(setLogout());
  };

  const onError = (error) => {
    dispatch(setErrorMessage(error));
  };

  return (
    <div>
      <LoginV2
        onConnect={onConnect}
        onDisconnect={onDisconnect}
        onError={onError}
      />
    </div>
  );
};

export default Login;
