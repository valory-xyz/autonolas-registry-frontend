/* eslint-disable no-console */
// import { useEffect } from 'react';
import Web3 from 'web3';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { Typography, notification } from 'antd';
import RegisterForm from 'common-util/List/RegisterForm';
import {
  COMPONENT_REGISTRY_ADDRESS,
  COMPONENT_REGISTRY,
} from 'common-util/AbiAndAddresses/contract';
import {
  MECH_MINTER_ADDRESS,
  MECH_MINTER_CONTRACT,
} from 'common-util/AbiAndAddresses/mechMinter';

const { Title } = Typography;

const RegisterComponents = ({ account }) => {
  const router = useRouter();

  const handleCancel = () => {
    router.push('/');
  };

  const handleSubmit = async (values) => {
    if (account) {
      console.log(account);
      window.ethereum.enable();
      const web3 = new Web3(window.web3.currentProvider);

      // contractAddress and abi are setted after contract deploy
      const contract = new web3.eth.Contract(
        MECH_MINTER_CONTRACT.abi,
        MECH_MINTER_ADDRESS,
      );

      const registryContract = new web3.eth.Contract(
        COMPONENT_REGISTRY.abi,
        COMPONENT_REGISTRY_ADDRESS,
      );

      contract.methods
        .mintComponent(
          values.dev_address,
          values.to_address,
          values.hash,
          values.description,
          values.dependencies ? values.dependencies.split(', ') : [],
        )
        // .call({ from: account })
        .send({ from: account })
        /*
        .send((error, result) => {
          console.log(result);
        });
        */
        .then((result) => {
          console.log(result);
          notification.success({ message: 'Component Minted' });

          registryContract.methods
            // .ownerOf('3')
            .totalSupply()
            .call()
            .then((e) => console.log(e))
            .catch((e) => console.log(e));

          // registryContract.getPastEvents('Transfer', {
          //   filter: {
          //     from: values.dev_address,
          //     to: values.to_address,
          //     tokenId: result,
          //   },
          //   fromBlock: 0,
          // }, (error, eventResult) => {
          //   console.log(error);
          //   console.log(eventResult);
          // });

          // registryContract.getPastEvents('AllEvents', {
          //   fromBlock: 0,
          //   toBlock: 'latest',
          // }, (error, eventResult) => {
          //   console.log(error);
          //   console.log(eventResult);
          // });

          // Transfer(address from, address to, uint256 tokenId)

          // contract.once(
          //   'Transfer',
          //   {
          //     filter: {
          //       from: values.dev_address,
          //       to: values.to_address,
          //       tokenId: result,
          //     },
          //   },
          //   (error, event) => {
          //     console.log(error);
          //     console.log(event);
          //   },
          // );
        })
        .catch((e) => {
          console.error(e);
        });

      registryContract.methods.balanceOf(account).call((error, result) => {
        console.log(result);
      });

      // ==================
      // const abc = await contract.methods
      //   .mintComponent(
      //     values.dev_address,
      //     values.to_address,
      //     values.hash,
      //     values.description,
      //     values.dependencies ? values.dependencies.split(', ') : [],
      //   )
      //   .call();
      // // .send({ from: account });
      // console.log('Transaction ==>>', abc);

      // const xyz = await contract.methods.componentRegistry().call();
      // console.log(xyz);

      // ===================
      // const minter = await contract.methods
      //   .mintComponent(
      //     values.dev_address,
      //     values.to_address,
      //     values.hash,
      //     values.description,
      //     values.dependencies ? values.dependencies.split(', ') : [],
      //   )
      //   .call();
      // console.log(minter);

      // const conTwo = new web3.eth.Contract(
      //   COMPONENT_REGISTRY.abi,
      //   COMPONENT_REGISTRY_ADDRESS,
      // );

      // const component = await conTwo.methods
      //   .balanceOf(account)
      //   .call();
      //   // .balanceOf(account);
      // console.log(component);
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
