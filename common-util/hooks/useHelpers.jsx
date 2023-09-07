import { useSelector } from 'react-redux';
import { getIsValidChainId } from '../functions';

export const useHelpers = () => {
  const account = useSelector((state) => state?.setup?.account);
  const chainId = useSelector((state) => state?.setup?.chainId);

  return {
    chainId,
    account,
    isValidChainId: getIsValidChainId(chainId),
  };
};
