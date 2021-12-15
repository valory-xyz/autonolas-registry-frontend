import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import Web3 from 'web3';
import { Tabs, Button, Typography } from 'antd';
import { EmptyMessage } from '../styles';
import { getBalance } from './utils';

const { ethers } = require('ethers');

const { TabPane } = Tabs;
const { Title } = Typography;

const ETHEREUM_NETWORK = 'ropsten';

const MenuServices = ({ account }) => {
  const handleTab = (key) => {
    console.log(key);
  };

  const btnClick = async () => {
    console.log('object');
    // const itx = Web3.providers.WebsocketProvider(
    //   `wss://mainnet.infura.io/ws/v3/${INFURA_PROJECT_ID}`,
    // );
    // const web3Context = useWeb3(`wss://mainnet.infura.io/ws/v3/${}`);
    const itx = new ethers.providers.InfuraProvider(
      ETHEREUM_NETWORK,
      process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
    );

    const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_SECRET_ID, itx);
    console.log(`Signer public address: ${signer.address}`);

    /**
     * BALANCE
     */
    const { balance } = await itx.send('relay_getBalance', [signer.address]);
    console.log(`Current ITX balance: ${ethers.utils.formatEther(balance)}`);

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

    console.log(itx, signer);
  };

  return (
    <>
      <Title level={2}>Test</Title>
      <Tabs type="card" defaultActiveKey="all" onChange={handleTab}>
        <TabPane tab="All" key="all">
          <EmptyMessage>No services registered</EmptyMessage>
          <Button ghost type="primary" onClick={btnClick}>
            Register
          </Button>
        </TabPane>
        <TabPane tab="My Test" key="my_services">
          {account ? (
            <EmptyMessage>No services registered</EmptyMessage>
          ) : (
            <EmptyMessage width="180px">
              To see your services, connect a wallet.
            </EmptyMessage>
          )}
        </TabPane>
      </Tabs>
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
