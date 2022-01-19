import { useState } from 'react';
import Web3 from 'web3';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { Typography, notification } from 'antd';
import RegisterForm from 'common-util/List/RegisterForm';
import { AlertInfo, AlertError } from 'common-util/ListCommon';
import {
  MECH_MINTER_ADDRESS,
  MECH_MINTER_CONTRACT,
} from 'common-util/AbiAndAddresses/mechMinter';

const { Title } = Typography;

const RegisterComponent = ({ account }) => {
  const [error, setError] = useState(null);
  const [information, setInformation] = useState(null);
  const router = useRouter();

  const handleCancel = () => {
    router.push('/');
  };

  const handleSubmit = async (values) => {
    if (account) {
      window.ethereum.enable();
      setError(null);
      setInformation(null);

      const web3 = new Web3(window.web3.currentProvider);
      const contract = new web3.eth.Contract(
        MECH_MINTER_CONTRACT.abi,
        MECH_MINTER_ADDRESS,
      );

      contract.methods
        .mintComponent(
          values.owner_address,
          values.developer_address,
          values.hash,
          values.description,
          values.dependencies ? values.dependencies.split(', ') : [],
        )
        .send({ from: account })
        .then((result) => {
          setInformation(result);
          notification.success({ message: 'Component registered' });
        })
        .catch((e) => {
          setError(e);
          console.error(e);
        });
    }
  };

  return (
    <>
      <Title level={2}>Register Component</Title>
      <RegisterForm
        listType="component"
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />
      <AlertInfo information={information} />
      <AlertError error={error} />
    </>
  );
};

RegisterComponent.propTypes = {
  account: PropTypes.string,
};

RegisterComponent.defaultProps = {
  account: null,
};

const mapStateToProps = (state) => {
  const { account, balance } = state.setup;
  return { account, balance };
};

export default connect(mapStateToProps, {})(RegisterComponent);
