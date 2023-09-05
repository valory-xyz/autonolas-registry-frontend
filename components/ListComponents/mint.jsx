import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Typography, notification } from 'antd';
import RegisterForm from 'common-util/List/RegisterForm';
import { AlertSuccess, AlertError } from 'common-util/List/ListCommon';
import { getMechMinterContract } from 'common-util/Contracts';
import { triggerTransaction } from 'common-util/functions/triggerTransaction';
import { checkIfERC721Receive } from 'common-util/functions/requests';
import { notifyError } from 'common-util/functions';
import { FormContainer } from '../styles';

const { Title } = Typography;

const MintComponent = () => {
  const account = useSelector((state) => state?.setup?.account);
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

      try {
        const isValid = await checkIfERC721Receive(
          account,
          values.owner_address,
        );
        if (!isValid) {
          setIsMinting(false);
          return;
        }
      } catch (e) {
        setIsMinting(false);
        console.error(e);
      }

      const contract = await getMechMinterContract();
      const fn = contract
        .create(
          '0',
          values.owner_address,
          `0x${values.hash}`,
          values.dependencies ? values.dependencies.split(', ') : [],
        )
        .send({ from: account });

      triggerTransaction(fn, account)
        .then((result) => {
          setInformation(result);
          notification.success({ message: 'Component minted' });
        })
        .catch((e) => {
          setError(e);
          console.error(e);
          notifyError('Error minting component');
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

export default MintComponent;
