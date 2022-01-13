/* eslint-disable no-console */
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Typography, Button, notification, Skeleton,
} from 'antd';
import {
  getMappedArrayFromString,
  // AlertInfo,
  AlertError,
} from 'common-util/ListCommon';
import {
  SERVICE_REGISTRY_ADDRESS,
  SERVICE_REGISTRY,
} from 'common-util/AbiAndAddresses/serviceRegistry';
import {
  SERVICE_MANAGER_ADDRESS,
  SERVICE_MANAGER,
} from 'common-util/AbiAndAddresses/serviceManager';
import RegisterForm from './RegisterForm';
import { RegisterFooter } from '../styles';

const { Title } = Typography;

const Service = ({ account }) => {
  const [isAllLoading, setAllLoading] = useState(false);
  const [serviceInfo, setServiceInfo] = useState({});
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (account) {
      window.ethereum.enable();
      setAllLoading(true);
      setServiceInfo({});

      const web3 = new Web3(window.web3.currentProvider);
      const contract = new web3.eth.Contract(
        SERVICE_REGISTRY.abi,
        SERVICE_REGISTRY_ADDRESS,
      );

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
    console.log(account);
    if (account) {
      setError(null);

      window.ethereum.enable();
      const web3 = new Web3(window.web3.currentProvider);

      const contract = new web3.eth.Contract(
        SERVICE_MANAGER.abi,
        SERVICE_MANAGER_ADDRESS,
      );

      contract.methods
        .serviceUpdate(
          values.owner_address,
          values.service_name,
          values.service_description,
          '0x0', // configHash
          getMappedArrayFromString(values.agent_ids),
          getMappedArrayFromString(values.agent_num_slots),
          values.threshold,
          values.service_id,
        )
        .send({ from: account })
        .then((result) => {
          console.log(result);
          // setInformation(result);
          notification.success({ message: 'Service Updated' });
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
      <Title level={2}>Service</Title>
      {account ? (
        <>
          {isAllLoading ? (
            <Skeleton active />
          ) : (
            <RegisterForm
              isUpdateForm
              account={account}
              formInitialValues={serviceInfo}
              handleSubmit={handleSubmit}
            />
          )}
        </>
      ) : (
        <RegisterFooter>
          <p>To register, connect to wallet</p>
          <Button onClick={handleCancel}>Cancel</Button>
        </RegisterFooter>
      )}

      {/* <AlertInfo type="Updated" information={information} /> */}
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
