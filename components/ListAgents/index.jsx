import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tabs, Button, Typography } from 'antd';
import { useRouter } from 'next/router';
import { ListEmptyMessage } from 'common-util/ListCommon';
import { EmptyMessage } from '../styles';

const { TabPane } = Tabs;
const { Title } = Typography;

const MenuAgent = ({ account, balance }) => {
  const router = useRouter();

  const handleTab = (key) => {
    console.log(key);
  };

  // TODO: remove later
  console.log({ account, balance });

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
          <ListEmptyMessage type="agent" />
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
  balance: PropTypes.string,
};

MenuAgent.defaultProps = {
  account: null,
  balance: null,
};

const mapStateToProps = (state) => {
  const { account, balance } = state.setup;
  return { account, balance };
};

export default connect(mapStateToProps, {})(MenuAgent);
