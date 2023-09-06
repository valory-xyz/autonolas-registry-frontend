import { useSelector } from 'react-redux';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { ADDRESSES } from 'common-util/Contracts';
import { SERVICE_MANAGER_TOKEN_CONTRACT } from 'common-util/AbiAndAddresses';

export const useServiceSendTx = () => {
  const chainId = useSelector((state) => state?.setup?.chainId);

  // const { config } = usePrepareContractWrite({
  //   address: ADDRESSES[chainId].serviceManagerToken,
  //   abi: SERVICE_MANAGER_TOKEN_CONTRACT.abi,
  //   functionName: 'terminate',
  // });
  // const { writeAsync } = useContractWrite(config);

  const otherServiceManagerProps = {
    address: ADDRESSES[chainId].serviceManagerToken,
    abi: SERVICE_MANAGER_TOKEN_CONTRACT.abi,
  };

  const {
    data: terminateResponse,
    isLoading: isTerminateLoading,
    isSuccess: isTerminated,
    writeAsync: onTerminateRequest,
  } = useContractWrite({
    ...otherServiceManagerProps,
    functionName: 'terminate',
  });

  //
  console.log();

  return {
    // terminate
    data: terminateResponse,
    isTerminateLoading,
    isTerminated,
    onTerminateRequest,

    // activate
  };
};
