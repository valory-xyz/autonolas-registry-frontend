import { useState } from 'react';
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
import {
  checkIfERC721Receive,
  getEstimatedGasLimit,
} from 'common-util/functions/requests';
import { useHelpers } from 'common-util/hooks';
import { useSvmConnectivity } from 'common-util/hooks/useSvmConnectivity';
import RegisterForm from './helpers/RegisterForm';
import { getAgentParams } from './utils';
import { buildSvmArgsToMintOrUpdate } from './helpers/functions';
import { FormContainer } from '../styles';

const { Title } = Typography;

const MintService = () => {
  const {
    account, doesNetworkHaveValidServiceManagerToken, vmType, isSvm,
  } = useHelpers();
  const { solanaAddresses, program } = useSvmConnectivity();

  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState(null);
  const [information, setInformation] = useState(null);

  const buildSvmCreateFn = async (values) => {
    const { owner_address: ownerAddress } = values;

    const args = [ownerAddress, ...buildSvmArgsToMintOrUpdate(values)];
    const fn = program.methods
      .create(...args)
      .accounts({ dataAccount: solanaAddresses.storageAccount })
      .remainingAccounts([
        { pubkey: ownerAddress, isSigner: true, isWritable: true },
      ]);

    return fn;
  };

  const buildEvmParams = async (values) => {
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

    return params;
  };

  const handleSubmit = async (values) => {
    if (!account) {
      notifyError('Wallet not connected');
      return;
    }

    setIsMinting(true);
    setError(null);
    setInformation(null);

    let fn;

    if (isSvm) {
      fn = await buildSvmCreateFn(values);
    } else {
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
      const params = buildEvmParams(values);
      const createFn = contract.methods.create(...params);
      const estimatedGas = await getEstimatedGasLimit(createFn, account);
      fn = createFn.send({ from: account, gasLimit: estimatedGas });
    }

    try {
      const result = sendTransaction(fn, account || undefined, {
        vmType,
        registryAddress: solanaAddresses.serviceRegistry,
      });
      setInformation(result);
      notifySuccess('Service minted');
    } catch (e) {
      setError(e);
      console.error(e);
      notifyError("Couldn't mint service");
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <>
      <FormContainer>
        <Title level={2}>Mint Service</Title>
        <RegisterForm
          isLoading={isMinting}
          account={account}
          formInitialValues={{}}
          handleSubmit={handleSubmit}
        />
      </FormContainer>

      {/* todo: add link to new service on creation */}
      <AlertSuccess type="Service" information={information} />
      <AlertError error={error} />
    </>
  );
};

export default MintService;
