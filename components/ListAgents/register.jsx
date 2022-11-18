import { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { Typography, notification } from 'antd/lib';
import RegisterForm from 'common-util/List/RegisterForm';
import { AlertSuccess, AlertError } from 'common-util/List/ListCommon';
import { getMechMinterContract } from 'common-util/Contracts';
import { FormContainer } from 'components/styles';

const { Title } = Typography;

const RegisterAgent = ({ account }) => {
  const [error, setError] = useState(null);
  const [information, setInformation] = useState(null);
  const router = useRouter();

  const handleCancel = () => router.push('/agents');

  const handleSubmit = (values) => {
    if (account) {
      setError(null);
      setInformation(null);

      const contract = getMechMinterContract();

      contract.methods
        .create(
          '1',
          values.owner_address,
          `0x${values.hash}`,
          values.dependencies ? values.dependencies.split(', ') : [],
        )
        .send({ from: account })
        .on('transactionHash', (hash) => console.log('sign-message-1', hash)) // TODO: remove console
        .on('confirmation', (confirmationNumber, receipt) => console.log('sign-message-2', confirmationNumber, receipt)) // TODO: remove console
        .on('receipt', (receipt) => console.log('sign-message-2', receipt)) // TODO: remove console
        .then((result) => {
          setInformation(result);
          notification.success({ message: 'Agent registered' });
        })
        .catch((e) => {
          setError(e);
          console.error(e);
        });
    }
  };

  return (
    <>
      <FormContainer>
        <Title level={2}>Register Agent</Title>
        <RegisterForm
          listType="agent"
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
        />
      </FormContainer>
      <AlertSuccess type="Agent" information={information} />
      <AlertError error={error} />
    </>
  );
};

RegisterAgent.propTypes = {
  account: PropTypes.string,
};

RegisterAgent.defaultProps = {
  account: null,
};

const mapStateToProps = (state) => {
  const { account, balance } = state.setup;
  return { account, balance };
};

export default connect(mapStateToProps, {})(RegisterAgent);
