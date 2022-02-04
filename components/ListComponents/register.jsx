import { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { Typography, notification } from 'antd';
import RegisterForm from 'common-util/List/RegisterForm';
import { AlertInfo, AlertError } from 'common-util/List/ListCommon';
import { getMechMinterContract } from 'common-util/Contracts';

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
      setError(null);
      setInformation(null);
      const contract = getMechMinterContract();
      const hashObject = {
        hash: `0x${values.hash}`,
        hashFunction: '0x12',
        size: '0x20',
      };

      contract.methods
        .mintComponent(
          values.owner_address,
          values.developer_address,
          hashObject,
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
