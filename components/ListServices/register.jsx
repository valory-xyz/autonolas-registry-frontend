import { useState } from 'react';
import Web3 from 'web3';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Button, Typography, notification } from 'antd';
import {
  getMappedArrayFromString,
  AlertInfo,
  AlertError,
} from 'common-util/ListCommon';
import {
  SERVICE_MANAGER_ADDRESS,
  SERVICE_MANAGER,
} from 'common-util/AbiAndAddresses/serviceManager';
import RegisterForm from './RegisterForm';
import { RegisterFooter } from '../styles';

const { Title } = Typography;

const RegisterService = ({ account }) => {
  const [error, setError] = useState(null);
  const [information, setInformation] = useState(null);
  const router = useRouter();

  const handleSubmit = (values) => {
    if (account) {
      window.ethereum.enable();
      setError(null);
      setInformation(null);

      const web3 = new Web3(window.web3.currentProvider);
      const contract = new web3.eth.Contract(
        SERVICE_MANAGER.abi,
        SERVICE_MANAGER_ADDRESS,
      );

      contract.methods
        .serviceCreate(
          values.owner_address,
          values.service_name,
          values.service_description,
          '0x0', // configHash
          getMappedArrayFromString(values.agent_ids),
          getMappedArrayFromString(values.agent_num_slots),
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
