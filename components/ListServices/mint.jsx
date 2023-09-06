import { useState } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Typography, notification } from 'antd';
import {
  DEFAULT_SERVICE_CREATION_ETH_TOKEN,
  DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS,
} from 'util/constants';
import {
  convertStringToArray,
  AlertSuccess,
  AlertError,
} from 'common-util/List/ListCommon';
import {
  getServiceManagerContract,
  getServiceManagerL2Contract,
} from 'common-util/Contracts';
import { sendTransaction } from 'common-util/functions/sendTransaction';
import { isL1Network, notifyError } from 'common-util/functions';
import { checkIfERC721Receive } from 'common-util/functions/requests';
import RegisterForm from './RegisterForm';
import { getAgentParams } from './utils';
import { FormContainer } from '../styles';

const { Title } = Typography;

const MintService = ({ account }) => {
  const router = useRouter();
  const chainId = useSelector((state) => state?.setup?.chainId);

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

      const contract = isL1Network(chainId)
        ? getServiceManagerContract()
        : getServiceManagerL2Contract();

      const commonParams = [
        `0x${values.hash}`,
        convertStringToArray(values.agent_ids),
        getAgentParams(values),
        values.threshold,
      ];

      const params = isL1Network(chainId)
        ? [
          values.owner_address,
          values.token === DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS
            ? DEFAULT_SERVICE_CREATION_ETH_TOKEN
            : values.token,
          ...commonParams,
        ]
        : [values.owner_address, ...commonParams];

      const fn = contract.methods.create(...params).send({ from: account });
      sendTransaction(fn, account)
        .then((result) => {
          setInformation(result);
          notification.success({ message: 'Service minted' });
        })
        .catch((e) => {
          setError(e);
          console.error(e);
          notifyError('Error minting service');
        })
        .finally(() => {
          setIsMinting(false);
        });
    }
  };

  const handleCancel = () => router.push('/services');

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

MintService.propTypes = {
  account: PropTypes.string,
};

MintService.defaultProps = {
  account: null,
};

const mapStateToProps = (state) => {
  const { account } = state.setup;
  return { account };
};

export default connect(mapStateToProps, {})(MintService);
