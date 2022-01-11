import { useState, useEffect } from 'react';
import Web3 from 'web3';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Tabs, Button, Typography, Card, Skeleton,
} from 'antd';
import { useRouter } from 'next/router';
import { ListEmptyMessage, PrintJson } from 'common-util/ListCommon';
import {
  AGENT_REGISTRY_ADDRESS,
  AGENT_REGISTRY,
} from 'common-util/AbiAndAddresses/agentRegistry';
import { EmptyMessage } from '../styles';

const { TabPane } = Tabs;
const { Title } = Typography;

const MenuAgent = ({ account }) => {
  const [isAgentListLoading, setAgentListLoading] = useState(false);
  const [list, setList] = useState([]);
  const router = useRouter();

  const handleTab = () => {};

  useEffect(() => {
    if (account) {
      window.ethereum.enable();
      setAgentListLoading(true);
      setList([]);

      const web3 = new Web3(window.web3.currentProvider);
      const contract = new web3.eth.Contract(
        AGENT_REGISTRY.abi,
        AGENT_REGISTRY_ADDRESS,
      );

      contract.methods
        .balanceOf(account)
        .call()
        .then(async (length) => {
          const promises = [];
          for (let i = 1; i <= length; i += 1) {
            const agentId = `${i}`;
            const result = contract.methods.getAgentInfo(agentId).call();
            promises.push(result);
          }

          Promise.all(promises).then((results) => {
            setAgentListLoading(false);
            setList(results);
          });
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [account]);

  const getAllTabDetails = () => {
    if (isAgentListLoading) {
      return <Skeleton active />;
    }

    return (
      <>
        {list.length === 0 ? (
          <ListEmptyMessage type="agent" />
        ) : (
          list.map((item, index) => (
            <Card
              title={`Id: ${index + 1}`}
              extra={null}
              key={`eachAgent-${index + 1}`}
              style={{ marginBottom: 16 }}
            >
              <PrintJson value={item} />
            </Card>
          ))
        )}
      </>
    );
  };

  return (
    <>
      <Title level={2}>Agents</Title>
      <Tabs
        type="card"
        defaultActiveKey="all"
        onChange={handleTab}
        tabBarExtraContent={(
          <Button
            ghost
            type="primary"
            onClick={() => router.push('/agents/register')}
          >
            Register
          </Button>
        )}
      >
        <TabPane tab="All" key="all">
          {getAllTabDetails()}
        </TabPane>
        <TabPane tab="My Agents" key="my_agents">
          {account ? (
            <ListEmptyMessage type="agent" />
          ) : (
            <EmptyMessage width="200px">
              To see your agents, connect a wallet.
            </EmptyMessage>
          )}
        </TabPane>
      </Tabs>
    </>
  );
};

MenuAgent.propTypes = {
  account: PropTypes.string,
  // balance: PropTypes.string,
};

MenuAgent.defaultProps = {
  account: null,
  // balance: null,
};

const mapStateToProps = (state) => {
  const { account, balance } = state.setup;
  return { account, balance };
};

export default connect(mapStateToProps, {})(MenuAgent);
