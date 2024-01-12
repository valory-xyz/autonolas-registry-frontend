import { useState } from 'react';
import { useRouter } from 'next/router';
import { Typography } from 'antd';
import { notifyError, notifySuccess } from '@autonolas/frontend-library';

import {
  DEFAULT_SERVICE_CREATION_ETH_TOKEN,
  DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS,
} from 'util/constants';
import {
  convertStringToArray,
  AlertSuccess,
  AlertError,
} from 'common-util/List/ListCommon';
import { getServiceManagerContract } from 'common-util/Contracts';
import { sendTransaction } from 'common-util/functions';
import { checkIfERC721Receive } from 'common-util/functions/requests';
import { useHelpers } from 'common-util/hooks';
import RegisterForm from './RegisterForm';
import { getAgentParams } from './utils';
import { FormContainer } from '../styles';

const { Title } = Typography;

const ESTIMATED_GAS_LIMIT = 500_000;

const getEstimatedGasLimit = async (fn, account) => {
  if (!account) {
    throw new Error('Invalid account passed to estimate gas limit');
  }

  try {
    const estimatedGas = await fn.estimateGas({ from: account });
    return Math.floor(estimatedGas);
  } catch (error) {
    window.console.warn(
      `Error occured on estimating gas, defaulting to ${ESTIMATED_GAS_LIMIT}`,
    );
  }

  return ESTIMATED_GAS_LIMIT;
};

const MintService = () => {
  const router = useRouter();
  const { account, chainName, doesNetworkHaveValidServiceManagerToken } = useHelpers();

  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState(null);
  const [information, setInformation] = useState(null);

  const handleSubmit = async (values) => {
    if (account) {
      setIsMinting(true);
      setError(null);
      setInformation(null);

      try {
        const isValid = await checkIfERC721Receive(
          account,
          values.owner_address,
        );
        if (!isValid) {
          setIsMinting(false);
          return;
        }
      } catch (e) {
        setIsMinting(false);
        console.error(e);
      }

      const contract = getServiceManagerContract();

      const commonParams = [
        `0x${values.hash}`,
        convertStringToArray(values.agent_ids),
        getAgentParams(values),
        values.threshold,
      ];

      const params = doesNetworkHaveValidServiceManagerToken
        ? [
          values.owner_address,
          values.token === DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS
            ? DEFAULT_SERVICE_CREATION_ETH_TOKEN
            : values.token,
          ...commonParams,
        ]
        : [values.owner_address, ...commonParams];

      try {
        const createConstruct = contract.methods.create(...params);
        const gasEstimate = await getEstimatedGasLimit(
          createConstruct,
          account,
        );

        const fn = createConstruct.send({
          from: account,
          gasLimit: gasEstimate,
        });
        sendTransaction(fn, account)
          .then((result) => {
            setInformation(result);
            notifySuccess('Service minted');
          })
          .catch((e) => {
            setError(e);
            console.error(e);
            notifyError('Error minting service');
          })
          .finally(() => {
            setIsMinting(false);
          });
      } catch (estimateGasError) {
        window.console.log('Error occured when minting service');
        throw estimateGasError;
      }
    }
  };

  const handleCancel = () => router.push(`/${chainName}/services`);

  return (
    <>
      <FormContainer>
        <Title level={2}>Mint Service</Title>
        <RegisterForm
          isLoading={isMinting}
          account={account}
          formInitialValues={{}}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
        />
      </FormContainer>

      <AlertSuccess type="Service" information={information} />
      <AlertError error={error} />
    </>
  );
};

export default MintService;
