import { useSelector } from 'react-redux';
import { SUPPORTED_CHAINS } from 'common-util/Login';

export const useHelpers = () => {
  const account = useSelector((state) => state?.setup?.account);
  const chainId = useSelector((state) => state?.setup?.chainId);
  const isValidChainId = SUPPORTED_CHAINS.some((e) => e.id === chainId);

  return {
    chainId,
    account,
    isValidChainId,
  };
};
