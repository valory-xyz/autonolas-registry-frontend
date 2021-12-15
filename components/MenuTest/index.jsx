import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import Web3 from 'web3';
import { Button, Typography } from 'antd';
// import { EmptyMessage } from '../styles';
import { getProviderAndSigner, getBalance } from './utils';


const { Title } = Typography;

const MenuServices = ({ account }) => {
  console.log(account);
  const btnClick = async () => {
    console.log('object');
    // const itx = Web3.providers.WebsocketProvider(
    //   `wss://mainnet.infura.io/ws/v3/${INFURA_PROJECT_ID}`,
    // );
    // const web3Context = useWeb3(`wss://mainnet.infura.io/ws/v3/${}`);

    const { itx, signer } = getProviderAndSigner();

    getBalance(itx, signer);

    /**
     * DEPOSIT
     */
    // const depositTx = await signer.sendTransaction({
    //   // Address of the ITX deposit contract
    //   to: '0x015C7C7A7D65bbdb117C573007219107BD7486f9',
    //   // The amount of ether you want to deposit in your ITX gas tank
    //   value: ethers.utils.parseUnits('0.00001', 'ether'),
    // });
    // console.log('Mining deposit transaction...');
    // console.log(
    //   `https://${ETHEREUM_NETWORK}.etherscan.io/tx/${depositTx.hash}`,
    // );

    // Waiting for the transaction to be mined
    // const receipt = await depositTx.wait();

    // The transaction is now on chain!
    // console.log(`Mined in block ${receipt.blockNumber}`);
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
