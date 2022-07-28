import { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Typography, notification } from 'antd';
import {
  convertStringToArray,
  AlertInfo,
  AlertError,
} from 'common-util/List/ListCommon';
import { getServiceManagerContract } from 'common-util/Contracts';
import { FormContainer } from 'components/styles';
import RegisterForm from './RegisterForm';
import { getAgentParams } from './utils';

const { Title } = Typography;

const RegisterService = ({ account }) => {
  const [error, setError] = useState(null);
  const [information, setInformation] = useState(null);
  const router = useRouter();

  const handleSubmit = (values) => {
    if (account) {
      setError(null);
      setInformation(null);

      const contract = getServiceManagerContract();
      contract.methods
        .create(
          values.owner_address,
          `0x${values.hash}`,
          convertStringToArray(values.agent_ids),
          getAgentParams(values),
          values.threshold,
        )
        .send({ from: account })
        .then((result) => {
          setInformation(result);
          notification.success({ message: 'Service Created' });
        })
        .catch((e) => {
          setError(e);
          console.error(e);
        });
    }
  };

  const handleCancel = () => {
    router.push('/services');
  };

  return (
    <>
      <FormContainer>
        <Title level={2}>Register Service</Title>
        <RegisterForm
          account={account}
          formInitialValues={{}}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
        />
      </FormContainer>

      <AlertInfo information={information} />
      <AlertError error={error} />
    </>
  );
};

RegisterService.propTypes = {
  account: PropTypes.string,
};

RegisterService.defaultProps = {
  account: null,
};

const mapStateToProps = (state) => {
  const { account } = state.setup;
  return { account };
};

export default connect(mapStateToProps, {})(RegisterService);
