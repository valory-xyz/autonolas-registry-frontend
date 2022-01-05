/* eslint-disable no-console */
import { useState } from 'react';
import Web3 from 'web3';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { Typography, notification, Alert } from 'antd';
import RegisterForm from 'common-util/List/RegisterForm';
import {
  COMPONENT_REGISTRY_ADDRESS,
  COMPONENT_REGISTRY,
} from 'common-util/AbiAndAddresses/componentRegistry';
import {
  MECH_MINTER_ADDRESS,
  MECH_MINTER_CONTRACT,
} from 'common-util/AbiAndAddresses/mechMinter';

const { Title } = Typography;

const RegisterComponents = ({ account }) => {
  const [error, setError] = useState(null);
  const [information, setInformation] = useState(null);
  const router = useRouter();

  const handleCancel = () => {
    router.push('/');
  };

  const handleSubmit = async (values) => {
    console.log(account);
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

      const componentRegistryContract = new web3.eth.Contract(
        COMPONENT_REGISTRY.abi,
        COMPONENT_REGISTRY_ADDRESS,
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
          console.log(result);
          setInformation(result);
          notification.success({ message: 'Component Minted' });

          // checking the total supply after the component has been minted
          componentRegistryContract.methods
            .totalSupply()
            .call()
            .then((response) => console.log(`Now the total supply is: ${response}`))
            .catch((e) => console.log(e));
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

RegisterComponents.propTypes = {
  account: PropTypes.string,
};

RegisterComponents.defaultProps = {
  account: null,
};

const mapStateToProps = (state) => {
  const { account, balance } = state.setup;
  return { account, balance };
};

export default connect(mapStateToProps, {})(RegisterComponents);

/**
 * 1. register component or agent => through mechMinter
 * 2. call balanceOf on componentRegistry
 * 3.
 */
