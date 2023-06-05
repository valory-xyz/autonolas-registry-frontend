import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Typography, notification } from 'antd/lib';
import get from 'lodash/get';
import Loader from 'common-util/components/Loader';
import { convertStringToArray, AlertError } from 'common-util/List/ListCommon';
import { getServiceManagerContract } from 'common-util/Contracts';
import { FormContainer } from 'components/styles';
import {
  DEFAULT_SERVICE_CREATION_ETH_TOKEN,
  DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS,
} from 'util/constants';
import RegisterForm from './RegisterForm';
import {
  getAgentParams,
  getServiceDetails,
  getTokenAddressRequest,
} from './utils';

const { Title } = Typography;

const Service = ({ account }) => {
  const [isAllLoading, setAllLoading] = useState(false);
  const [serviceInfo, setServiceInfo] = useState({});
  const [error, setError] = useState(null);
  const router = useRouter();
  const id = get(router, 'query.id') || null;
  const [ethTokenAddress, setEthTokenAddress] = useState(false);

  useEffect(() => {
    (async () => {
      if (account) {
        setAllLoading(true);
        setServiceInfo({});

        const result = await getServiceDetails(id);
        setAllLoading(false);
        setServiceInfo(result);

        const token = await getTokenAddressRequest(id);
        setEthTokenAddress(token);
      }
    })();
  }, [account]);

  /* helper functions */
  const handleSubmit = (values) => {
    if (account) {
      setError(null);

      const token = values.token === DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS
        ? DEFAULT_SERVICE_CREATION_ETH_TOKEN
        : values.token;

      const contract = getServiceManagerContract();
      contract.methods
        .update(
          token,
          `0x${values.hash}`,
          convertStringToArray(values.agent_ids),
          getAgentParams(values),
          values.threshold,
          values.service_id,
        )
        .send({ from: account })
        .then(() => {
          notification.success({ message: 'Service Updated' });
        })
        .catch((e) => {
          console.error(e);
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
