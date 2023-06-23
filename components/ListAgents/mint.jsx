import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Typography, notification } from 'antd/lib';
import RegisterForm from 'common-util/List/RegisterForm';
import { AlertSuccess, AlertError } from 'common-util/List/ListCommon';
import { getMechMinterContract } from 'common-util/Contracts';
import { FormContainer } from 'components/styles';

const { Title } = Typography;

const MintAgent = () => {
  const account = useSelector((state) => state?.setup?.account);
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState(null);
  const [information, setInformation] = useState(null);
  const router = useRouter();

  const handleCancel = () => router.push('/agents');

  const handleSubmit = async (values) => {
    if (account) {
      // setIsMinting(true);
      setError(null);
      setInformation(null);

      const contract = getMechMinterContract(account);

      // const accounts = await window?.ethereum.request({
      //   method: 'eth_requestAccounts',
      // });

      console.log(contract);

      contract.methods
        .create(
          '1',
          values.owner_address,
          `0x${values.hash}`,
          values.dependencies ? values.dependencies.split(', ') : [],
        )
        .send({ from: account })
        .then((result) => {
          setInformation(result);
          notification.success({ message: 'Agent minted' });
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
        <Title level={2}>Mint Agent</Title>
        <RegisterForm
          isLoading={isMinting}
          listType="agent"
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
        />
      </FormContainer>
      <AlertSuccess type="Agent" information={information} />
      <AlertError error={error} />
    </>
  );
};

export default MintAgent;
