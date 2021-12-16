import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import Web3 from 'web3';
import { Button, Typography } from 'antd';
// import { EmptyMessage } from '../styles';
import {
  getProviderAndSigner,
  getBalance,
  deposit,
  callContract,
  waitTransaction,
} from './utils';

const { Title } = Typography;

const MenuServices = ({ account }) => {
  // console.log(account);
  const btnClick = async () => {
    console.log('object');
    // const itx = Web3.providers.WebsocketProvider(
    //   `wss://mainnet.infura.io/ws/v3/${INFURA_PROJECT_ID}`,
    // );
    // const web3Context = useWeb3(`wss://mainnet.infura.io/ws/v3/${}`);

    const { itx, signer } = getProviderAndSigner();

    console.log(itx, signer);
    await getBalance(itx, signer);

    // deposit to ITX if you don't have sufficient balance
    // await deposit(signer);

    const relay = await callContract(itx, signer);

    if (relay) {
      const hash = relay.relayTransactionHash;
      console.log(relay, hash);

      const receipt = await waitTransaction(itx, hash);
      console.log({ receipt });
    }
  };

  return (
    <>
      <Title level={2}>Test</Title>
      <Button ghost type="primary" onClick={btnClick}>
        Testnet
      </Button>
    </>
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

/**
 * - not much progress!
 * - not able to get any ether from faucet in testnetwork - ropsten
 * - getting infura error for getting balance
 *
 * - metamask login issue
 *
 * what you want to do in routes ticket?
 */
