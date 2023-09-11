import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Typography } from 'antd';
import RegisterForm from 'common-util/List/RegisterForm';
import { AlertSuccess, AlertError } from 'common-util/List/ListCommon';
import { getMechMinterContract } from 'common-util/Contracts';
import { sendTransaction } from 'common-util/functions/sendTransaction';
import { checkIfERC721Receive } from 'common-util/functions/requests';
import { notifyError, notifySuccess } from 'common-util/functions';
import { FormContainer } from '../styles';

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

      const contract = getMechMinterContract(account);

      const fn = contract.methods
        .create(
          '1',
          values.owner_address,
          `0x${values.hash}`,
          values.dependencies ? values.dependencies.split(', ') : [],
        )
        .send({ from: account });

      sendTransaction(fn, account)
        .then((result) => {
          setInformation(result);
          notifySuccess('Agent minted');
        })
        .catch((e) => {
          setError(e);
          console.error(e);
          notifyError('Error minting agent');
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
