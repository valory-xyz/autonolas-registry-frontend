/* eslint-disable no-console */
import { useState } from 'react';
import PropTypes from 'prop-types';
import Web3 from 'web3';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { Typography, notification, Alert } from 'antd';
import RegisterForm from 'common-util/List/RegisterForm';
import {
  MECH_MINTER_ADDRESS,
  MECH_MINTER_CONTRACT,
} from 'common-util/AbiAndAddresses/mechMinter';

const { Title } = Typography;

const RegisterAgents = ({ account }) => {
  const [error, setError] = useState(null);
  const [information, setInformation] = useState(null);
  const router = useRouter();

  const handleCancel = () => {
    router.push('/agents');
  };

  const handleSubmit = (values) => {
    if (account) {
      setError(null);
      setInformation(null);

      window.ethereum.enable();
      const web3 = new Web3(window.web3.currentProvider);

      // contractAddress and abi are setted after contract deploy
      const contract = new web3.eth.Contract(
        MECH_MINTER_CONTRACT.abi,
        MECH_MINTER_ADDRESS,
      );

      contract.methods
        .mintAgent(
          values.owner_address,
          values.developer_address,
          values.hash,
          values.description,
          values.dependencies ? values.dependencies.split(', ') : [],
        )
        .send({ from: account })
        .then((result) => {
          console.log(result);
          setInformation(result);
          notification.success({ message: 'Agent Minted' });

          // TODO: check the total supply
        })
        .catch((e) => {
          setError(e);
          console.error(e);
        });
    }
  };

  return (
    <>
      <Title level={2}>Register Agent</Title>
      <RegisterForm
        listType="agent"
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />
      {information && (
        <Alert
          message="Registered successfully!"
          description={(
            <div>
              <pre>{JSON.stringify(information, null, 2)}</pre>
            </div>
          )}
          type="info"
          showIcon
        />
      )}
      {error && (
        <Alert
          message="Error on Register!"
          description={(
            <div>
              <pre>{error.stack}</pre>
            </div>
          )}
          type="error"
          showIcon
        />
      )}
    </>
  );
};

RegisterAgents.propTypes = {
  account: PropTypes.string,
};

RegisterAgents.defaultProps = {
  account: null,
};

const mapStateToProps = (state) => {
  const { account, balance } = state.setup;
  return { account, balance };
};

export default connect(mapStateToProps, {})(RegisterAgents);
