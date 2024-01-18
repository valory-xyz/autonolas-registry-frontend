import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Typography } from 'antd';
import {
  notifySuccess,
  notifyError,
  Loader,
} from '@autonolas/frontend-library';

import {
  DEFAULT_SERVICE_CREATION_ETH_TOKEN,
  DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS,
} from 'util/constants';
import { convertStringToArray, AlertError } from 'common-util/List/ListCommon';
import { getServiceManagerContract } from 'common-util/Contracts';
import { sendTransaction } from 'common-util/functions';
import { useHelpers } from 'common-util/hooks';
import RegisterForm from './RegisterForm';
import { getAgentParams, getTokenAddressRequest } from './utils';
import { FormContainer } from '../styles';
import { useGetServiceDetails } from './useService';

const { Title } = Typography;

const Service = ({ account }) => {
  const router = useRouter();
  const {
    chainId, chainName, doesNetworkHaveValidServiceManagerToken, isSvm,
  } = useHelpers();
  const getDetails = useGetServiceDetails();

  const [isAllLoading, setAllLoading] = useState(false);
  const [serviceInfo, setServiceInfo] = useState({});
  const [error, setError] = useState(null);
  const [ethTokenAddress, setEthTokenAddress] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const id = router?.query?.id;

  useEffect(() => {
    const getData = async () => {
      try {
        setAllLoading(true);
        setServiceInfo({});

        const result = await getDetails(id);
        setAllLoading(false);
        setServiceInfo(result);

        // get token address for L1 only network
        // because L2 network do not have token address
        if (doesNetworkHaveValidServiceManagerToken && !isSvm) {
          const token = await getTokenAddressRequest(id);
          setEthTokenAddress(token);
        }
      } catch (e) {
        console.error(e);
      }
    };

    if (account && id) getData();
  }, [
    account,
    chainId,
    isSvm,
    id,
    doesNetworkHaveValidServiceManagerToken,
    getDetails,
  ]);

  /* helper functions */
  const handleSubmit = (values) => {
    const submitData = async () => {
      setIsUpdating(true);
      setError(null);

      const token = values.token === DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS
        ? DEFAULT_SERVICE_CREATION_ETH_TOKEN
        : values.token;

      const contract = getServiceManagerContract();

      const commonParams = [
        `0x${values.hash}`,
        convertStringToArray(values.agent_ids),
        getAgentParams(values),
        values.threshold,
        values.service_id,
      ];

      // token wil be passed only if the connected network has service manager token
      const params = doesNetworkHaveValidServiceManagerToken
        ? [token, ...commonParams]
        : [...commonParams];

      const fn = contract.methods.update(...params).send({ from: account });
      sendTransaction(fn, account)
        .then(() => {
          notifySuccess('Service updated');
        })
        .catch((e) => {
          console.error(e);
          notifyError('Error updating service');
        })
        .finally(() => {
          setIsUpdating(false);
        });
    };

    if (account) {
      submitData();
    }
  };

  const handleCancel = () => router.push(`/${chainName}/services`);

  return (
    <>
      <Title level={2} className="mt-0">
        Service
      </Title>
      {isAllLoading ? (
        <Loader />
      ) : (
        <FormContainer>
          <RegisterForm
            isUpdateForm
            isLoading={isUpdating}
            account={account}
            formInitialValues={serviceInfo}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
            ethTokenAddress={ethTokenAddress}
          />
        </FormContainer>
      )}
      <AlertError error={error} />
    </>
  );
};

Service.propTypes = {
  account: PropTypes.string,
};

Service.defaultProps = {
  account: null,
};

const mapStateToProps = (state) => {
  const { account } = state.setup;
  return { account };
};

export default connect(mapStateToProps, {})(Service);
