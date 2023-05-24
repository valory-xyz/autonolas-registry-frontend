import { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Typography, notification } from 'antd/lib';
import {
  convertStringToArray,
  AlertSuccess,
  AlertError,
} from 'common-util/List/ListCommon';
import { getServiceManagerContract } from 'common-util/Contracts';
import { FormContainer } from 'components/styles';
import RegisterForm from './RegisterForm';
import { getAgentParams } from './utils';

const { Title } = Typography;

const MintService = ({ account }) => {
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState(null);
  const [information, setInformation] = useState(null);
  const router = useRouter();

  const handleSubmit = (values) => {
    if (account) {
      setIsMinting(true);
      setError(null);
      setInformation(null);

      const contract = getServiceManagerContract();

      contract.methods
        .create(
          values.owner_address,
          values.token,
          `0x${values.hash}`,
          convertStringToArray(values.agent_ids),
          getAgentParams(values),
          values.threshold,
        )
        .send({ from: account })
        .then((result) => {
          setInformation(result);
          notification.success({ message: 'Service minted' });
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

  const handleCancel = () => {
    router.push('/services');
  };

  return (
    <>
      <FormContainer>
        <Title level={2}>Mint Service</Title>
        <RegisterForm
          isLoading={isMinting}
          account={account}
          formInitialValues={{}}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
        />
      </FormContainer>

      <AlertSuccess type="Service" information={information} />
      <AlertError error={error} />
    </>
  );
};

MintService.propTypes = {
  account: PropTypes.string,
};

MintService.defaultProps = {
  account: null,
};

const mapStateToProps = (state) => {
  const { account } = state.setup;
  return { account };
};

export default connect(mapStateToProps, {})(MintService);
