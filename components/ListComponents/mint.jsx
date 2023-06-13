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

const MintComponent = ({ account }) => {
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState(null);
  const [information, setInformation] = useState(null);
  const router = useRouter();

  const handleCancel = () => {
    router.push('/');
  };

  const handleSubmit = async (values) => {
    if (account) {
      setIsMinting(true);
      setError(null);
      setInformation(null);
      const contract = getMechMinterContract();

      contract.methods
        .create(
          '0',
          values.owner_address,
          `0x${values.hash}`,
          values.dependencies ? values.dependencies.split(', ') : [],
        )
        .send({ from: account })
        .then((result) => {
          setInformation(result);
          notification.success({ message: 'Component minted' });
        })
        .catch((e) => {
          setError(e);
          console.error(e);
        })
        .finally(() => {
          setIsMinting(false);
        });
    }
  };

  return (
    <>
      <FormContainer>
        <Title level={2}>Mint Component</Title>
        <RegisterForm
          isLoading={isMinting}
          listType="component"
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
        />
      </FormContainer>
      <AlertSuccess type="Component" information={information} />
      <AlertError error={error} />
    </>
  );
};

MintComponent.propTypes = {
  account: PropTypes.string,
};

MintComponent.defaultProps = {
  account: null,
};

const mapStateToProps = (state) => {
  const { account, balance } = state.setup;
  return { account, balance };
};

export default connect(mapStateToProps, {})(MintComponent);
