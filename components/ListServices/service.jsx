import { useState } from 'react';
import Web3 from 'web3';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Typography, Button, notification } from 'antd';
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

const Service = ({ account }) => {
  const [error, setError] = useState(null);
  const [information, setInformation] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  console.log(`service_id = ${id}`);

  const handleSubmit = (values) => {
    console.log(account);
    if (account) {
      setError(null);
      setInformation(null);

      window.ethereum.enable();
      const web3 = new Web3(window.web3.currentProvider);

      const contract = new web3.eth.Contract(
        SERVICE_MANAGER.abi,
        SERVICE_MANAGER_ADDRESS,
      );
      console.log(contract);

      // TODO: will uncomment once update method is complete
      // contract.methods
      //   .serviceUpdate(
      //     values.owner_address,
      //     values.service_name,
      //     values.service_description,
      //     getMappedArrayFromString(values.agent_ids),
      //     getMappedArrayFromString(values.agent_num_slots),
      //     getMappedArrayFromString(values.operator_slots),
      //     values.threshold,
      //     values.service_id,
      //   )
      //   .send({ from: account })
      //   .then((result) => {
      //     console.log(result);
      //     setInformation(result);
      //     notification.success({ message: 'Service Updated' });

      //     // TODO: check for exists using service-registry
      //   })
      //   .catch((e) => {
      //     setError(e);
      //     console.error(e);
      //   });
    }
  };

  const handleCancel = () => {
    router.push('/services');
  };

  return (
    <>
      <Title level={2}>Service</Title>
      {account ? (
        <RegisterForm
          isUpdateForm
          account={account}
          // TODO: after getting the service info, pass it to register form
          // formInitialValues={{ owner_address: 'dummy address' }}
          handleSubmit={handleSubmit}
        />
      ) : (
        <RegisterFooter>
          <p>To register, connect to wallet</p>
          <Button onClick={handleCancel}>Cancel</Button>
        </RegisterFooter>
      )}

      <AlertInfo type="Updated" information={information} />
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
