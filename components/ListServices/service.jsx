import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Typography, notification, Skeleton } from 'antd';
import get from 'lodash/get';
import { convertStringToArray, AlertError } from 'common-util/List/ListCommon';
import {
  getServiceContract,
  getServiceManagerContract,
} from 'common-util/Contracts';
import { FormContainer } from 'components/styles';
import RegisterForm from './RegisterForm';
import { getServiceHash, getAgentParams } from './utils';

const { Title } = Typography;

const Service = ({ account }) => {
  const [isAllLoading, setAllLoading] = useState(false);
  const [serviceInfo, setServiceInfo] = useState({});
  const [error, setError] = useState(null);
  const router = useRouter();
  const id = get(router, 'query.id') || null;

  useEffect(() => {
    if (account) {
      setAllLoading(true);
      setServiceInfo({});

      const contract = getServiceContract();
      contract.methods
        .getServiceInfo(id)
        .call()
        .then((result) => {
          setAllLoading(false);
          setServiceInfo(result);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [account]);

  /* helper functions */
  const handleSubmit = (values) => {
    if (account) {
      setError(null);

      const contract = getServiceManagerContract();
      contract.methods
        .serviceUpdate(
          values.service_name,
          values.service_description,
          getServiceHash(values), // configHash
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
          setError(e);
          console.error(e);
        });
    }
  };

  const handleCancel = () => router.push('/services');

  return (
    <>
      <Title level={2}>Service</Title>
      {isAllLoading ? (
        <Skeleton active />
      ) : (
        <FormContainer>
          <RegisterForm
            isUpdateForm
            account={account}
            formInitialValues={serviceInfo}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
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
