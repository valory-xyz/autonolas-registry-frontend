import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { Typography, notification } from 'antd/lib';
import get from 'lodash/get';
import {
  DEFAULT_SERVICE_CREATION_ETH_TOKEN,
  DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS,
} from 'util/constants';
import Loader from 'common-util/components/Loader';
import { convertStringToArray, AlertError } from 'common-util/List/ListCommon';
import {
  getServiceManagerContract,
  getServiceManagerL2Contract,
} from 'common-util/Contracts';
import { isL1Network, isL1OnlyNetwork } from 'common-util/functions';
import { sendTransaction } from 'common-util/functions/sendTransaction';
import RegisterForm from './RegisterForm';
import {
  getAgentParams,
  getServiceDetails,
  getTokenAddressRequest,
} from './utils';
import { FormContainer } from '../styles';

const { Title } = Typography;

const Service = ({ account }) => {
  const router = useRouter();
  const chainId = useSelector((state) => state?.setup?.chainId);

  const [isAllLoading, setAllLoading] = useState(false);
  const [serviceInfo, setServiceInfo] = useState({});
  const [error, setError] = useState(null);
  const [ethTokenAddress, setEthTokenAddress] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const id = get(router, 'query.id') || null;

  useEffect(() => {
    (async () => {
      if (account) {
        setAllLoading(true);
        setServiceInfo({});

        const result = await getServiceDetails(id);
        setAllLoading(false);
        setServiceInfo(result);

        // get token address for L1 only network
        // because L2 network do not have token address
        if (isL1OnlyNetwork(chainId)) {
          const token = await getTokenAddressRequest(id);
          setEthTokenAddress(token);
        }
      }
    })();
  }, [account]);

  /* helper functions */
  const handleSubmit = (values) => {
    if (account) {
      setIsUpdating(true);
      setError(null);

      const token = values.token === DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS
        ? DEFAULT_SERVICE_CREATION_ETH_TOKEN
        : values.token;

      const contract = isL1Network(chainId)
        ? getServiceManagerContract()
        : getServiceManagerL2Contract();

      const commonParams = [
        `0x${values.hash}`,
        convertStringToArray(values.agent_ids),
        getAgentParams(values),
        values.threshold,
        values.service_id,
      ];

      // token wil be passed only for L1
      const params = isL1Network(chainId)
        ? [token, ...commonParams]
        : [...commonParams];

      const fn = contract.methods.update(...params).send({ from: account });
      sendTransaction(fn, account)
        .then(() => {
          notification.success({ message: 'Service Updated' });
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          setIsUpdating(false);
        });
    }
  };

  const handleCancel = () => router.push('/services');

  return (
    <>
      <Title level={2}>Service</Title>
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
