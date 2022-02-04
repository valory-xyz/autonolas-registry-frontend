import { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Button, Typography, notification } from 'antd';
import {
  convertStringToArray,
  AlertInfo,
  AlertError,
} from 'common-util/List/ListCommon';
import { getServiceManagerContract } from 'common-util/Contracts';
import RegisterForm from './RegisterForm';
import { RegisterFooter } from '../styles';

const { Title } = Typography;

const RegisterService = ({ account }) => {
  const [error, setError] = useState(null);
  const [information, setInformation] = useState(null);
  const router = useRouter();

  const handleSubmit = (values) => {
    if (account) {
      setError(null);
      setInformation(null);
      const hashObject = {
        hash: `0x${values.hash || '0'.repeat(64)}`,
        hashFunction: '0x12',
        size: '0x20',
      };

      const contract = getServiceManagerContract();
      contract.methods
        .serviceCreate(
          values.owner_address,
          values.service_name,
          values.service_description,
          hashObject, // configHash
          convertStringToArray(values.agent_ids),
          convertStringToArray(values.agent_num_slots),
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
      <Title level={2}>Register Service</Title>
      {account ? (
        <RegisterForm
          account={account}
          formInitialValues={{}}
          handleSubmit={handleSubmit}
        />
      ) : (
        <RegisterFooter>
          <p>To register, connect to wallet</p>
          <Button onClick={handleCancel}>Cancel</Button>
        </RegisterFooter>
      )}

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
