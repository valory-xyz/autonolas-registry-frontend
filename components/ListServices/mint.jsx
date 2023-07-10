import { useState } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Typography, notification } from 'antd/lib';
import {
  convertStringToArray,
  AlertSuccess,
  AlertError,
} from 'common-util/List/ListCommon';
import {
  getServiceManagerContract,
  getServiceManagerGoerliContract,
  getServiceManagerL2Contract,
} from 'common-util/Contracts';
import { FormContainer } from 'components/styles';
import {
  DEFAULT_SERVICE_CREATION_ETH_TOKEN,
  DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS,
} from 'util/constants';
import { isMainnetOrLocalOnly, isMainnet } from 'common-util/functions';
import { isGoerli } from '@autonolas/frontend-library';
import RegisterForm from './RegisterForm';
import { getAgentParams } from './utils';

const { Title } = Typography;

const MintService = ({ account }) => {
  const router = useRouter();
  const chainId = useSelector((state) => state?.setup?.chainId);

  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState(null);
  const [information, setInformation] = useState(null);

  const handleSubmit = (values) => {
    if (account) {
      setIsMinting(true);
      setError(null);
      setInformation(null);

      const getContract = () => {
        if (isMainnet(chainId)) return getServiceManagerContract();
        if (isGoerli(chainId)) return getServiceManagerGoerliContract();
        return getServiceManagerL2Contract();
      };

      const commonParams = [
        `0x${values.hash}`,
        convertStringToArray(values.agent_ids),
        getAgentParams(values),
        values.threshold,
      ];

      const params = isMainnetOrLocalOnly(chainId)
        ? [
          values.owner_address,
          values.token === DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS
            ? DEFAULT_SERVICE_CREATION_ETH_TOKEN
            : values.token,
          ...commonParams,
        ]
        : [values.owner_address, ...commonParams];

      getContract()
        .methods.create(...params)
        .send({ from: account })
        .then((result) => {
          setInformation(result);
          notification.success({ message: 'Service minted' });
        })
        .catch((e) => {
          setError(e);
          console.error(e);
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
