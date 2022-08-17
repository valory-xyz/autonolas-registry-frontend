import { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import Web3 from 'web3';
import {
  Button, Typography, Spin, Alert, Input,
} from 'antd/lib';
import {
  getProviderAndSigner,
  getBalance,
  deposit,
  callContract,
  waitTransaction,
} from './utils';
import { Container } from './styles';

const { Title } = Typography;

// eslint-disable-next-line no-unused-vars
const MenuServices = ({ account }) => {
  const [balance, setBalance] = useState(null);
  const [receiptLoading, setLoading] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [toAddress, setToAddress] = useState(null);
  const [depositEthAmount, setDepositEth] = useState(0.001);
  const [contractMessage, setContractMessage] = useState('');

  const handleBalance = async () => {
    const { itx, signer } = getProviderAndSigner(privateKey);
    const b = await getBalance(itx, signer);
    setBalance(b);
  };

  const handleDeposit = async () => {
    const { signer } = getProviderAndSigner(privateKey);

    // deposit to ITX if you don't have sufficient balance
    await deposit(signer, depositEthAmount.toString());
  };

  const handleTransaction = async () => {
    setLoading(null);
    const { itx, signer } = getProviderAndSigner(privateKey);
    const relay = await callContract(itx, signer, toAddress, contractMessage);

    if (relay) {
      const hash = relay.relayTransactionHash;
      setLoading(true);
      const response = await waitTransaction(itx, hash);
      setLoading(false);
      setReceipt(response);
    }
  };

  const isBtnDisabled = !privateKey;

  return (
    <Container>
      <Title level={2}>Test</Title>

      <Input
        addonBefore="Private Key"
        value={privateKey}
        onChange={(e) => setPrivateKey(e.target.value)}
      />

      <div style={{ marginBottom: 32 }}>
        <Button
          ghost
          type="primary"
          onClick={handleBalance}
          disabled={isBtnDisabled}
        >
          Show ITX Balance
        </Button>
        {balance && (
          <>
            <Alert message={balance.balance} type="info" showIcon />
            <pre>{JSON.stringify(balance, null, 2)}</pre>
          </>
        )}
      </div>

      <div>
        <Input
          addonBefore="To Address"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
        />
        <Input
          addonBefore="Message"
          value={contractMessage}
          onChange={(e) => setContractMessage(e.target.value)}
        />
        <Button
          ghost
          disabled={isBtnDisabled || !contractMessage}
          type="primary"
          onClick={handleTransaction}
        >
          Send Contract
        </Button>
        {receiptLoading !== null && (
          <>
            {receiptLoading ? (
              <>
                &nbsp;
                &nbsp;
                <Spin />
              </>
            ) : (
              <Alert
                message="Information"
                description={<pre>{JSON.stringify(receipt, null, 2)}</pre>}
                type="info"
                showIcon
              />
            )}
          </>
        )}
      </div>

      <div style={{ marginTop: 32 }}>
        <Input
          addonBefore="ETH"
          value={depositEthAmount}
          onChange={(e) => setDepositEth(e.target.value)}
        />

        <Button
          ghost
          disabled={isBtnDisabled}
          type="primary"
          onClick={handleDeposit}
        >
          Deposit to ITX
        </Button>
      </div>
    </Container>
  );
};

MenuServices.propTypes = {
  account: PropTypes.string,
};

MenuServices.defaultProps = {
  account: null,
};

const mapStateToProps = (state) => {
  const { account } = state.setup;
  return { account };
};

export default connect(mapStateToProps, {})(MenuServices);
