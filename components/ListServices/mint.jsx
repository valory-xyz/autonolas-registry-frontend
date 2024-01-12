import { useState } from 'react';
import { Typography } from 'antd';
import { notifyError, notifySuccess } from '@autonolas/frontend-library';

import {
  DEFAULT_SERVICE_CREATION_ETH_TOKEN,
  DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS,
  VM_TYPE,
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
import { useSvmInfo } from 'common-util/hooks/useSvmInfo';
import { BN } from '@project-serum/anchor';
import RegisterForm from './RegisterForm';
import { getAgentParams } from './utils';
import { FormContainer } from '../styles';

const { Title } = Typography;

const MintService = () => {
  const {
    account, doesNetworkHaveValidServiceManagerToken, vmType, isSvm,
  } = useHelpers();
  const { getAddresses } = useSvmInfo();

  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState(null);
  const [information, setInformation] = useState(null);

  const { wallet, program } = useSvmInfo();

  const buildSvmFn = async (values) => {
    const {
      owner_address: ownerAddress,
      hash,
      agent_ids: agentIdsSrc,
      agent_num_slots: slotsSrc,
      bonds,
      threshold: thresholdStr,
    } = values;

    const serviceOwnerPublicKey = ownerAddress;
    // // Convert hash to bytes32 Buffer
    const configHash = Buffer.from(hash, 'hex');
    // // Convert agent_ids to an array
    const agentIds = convertStringToArray(agentIdsSrc);
    // // Use agent_num_slots to define slots
    const slots = convertStringToArray(slotsSrc).map(Number);
    // // Convert bonds to an array of BN
    const bondsArray = convertStringToArray(bonds).map((bond) => new BN(bond));
    // numberfy threshold
    const threshold = Number(thresholdStr);

    const fn = program.methods
      .create(
        serviceOwnerPublicKey,
        configHash,
        agentIds,
        slots,
        bondsArray,
        threshold,
      )
      .accounts({ dataAccount: getAddresses().storageAccount })
      .remainingAccounts([
        { pubkey: serviceOwnerPublicKey, isSigner: true, isWritable: true },
      ]);

    return fn;
  };

  const handleSubmit = async (values) => {
    if (isSvm ? !wallet.publicKey : !account) {
      notifyError('Wallet not connected');
      return;
    }

    setIsMinting(true);
    setError(null);
    setInformation(null);

    let fn;

    if (vmType === VM_TYPE.SVM) {
      fn = await buildSvmFn(values);
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

      // really not super clear on what's going on here
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

      fn = contract.methods.create(...params).send({ from: account });
    }

    sendTransaction(fn, account || undefined, vmType)
      .then((result) => {
        setInformation(result);
        notifySuccess('Service minted');
      })
      .catch((e) => {
        setError(e);
        console.error(e);
        notifyError("Couldn't mint service");
      })
      .finally(() => {
        setIsMinting(false);
      });
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
