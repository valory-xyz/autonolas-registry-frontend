import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tabs, Button, Typography } from 'antd';
import { useRouter } from 'next/router';
import { URL } from 'util/constants';
import ListCards from 'common-util/List/ListCards';
import { getAgents, getAgentsByAccount } from './utils';

const { TabPane } = Tabs;
const { Title } = Typography;

const MenuAgent = ({ account }) => {
  const router = useRouter();

  return (
    <>
      <Title level={2}>Agents</Title>
      <Tabs
        type="card"
        defaultActiveKey="all"
        tabBarExtraContent={(
          <Button
            ghost
            type="primary"
            onClick={() => router.push(URL.REGISTER_AGENT)}
          >
            Register
          </Button>
        )}
      >
        <TabPane tab="All" key="all">
          <ListCards type="agent" getList={getAgents} />
        </TabPane>
        <TabPane tab="My Agents" key="my_agents">
          <ListCards type="agent" getList={() => getAgentsByAccount(account)} />
        </TabPane>
      </Tabs>
    </>
  );
};

MenuAgent.propTypes = {
  account: PropTypes.string,
};

MenuAgent.defaultProps = {
  account: null,
};

const mapStateToProps = (state) => {
  const { account } = state.setup;
  return { account };
};

export default connect(mapStateToProps, {})(MenuAgent);
