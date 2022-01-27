import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import { useRouter } from 'next/router';
import { URL, NAV_TYPES } from 'util/constants';
import ListTable from 'common-util/List/ListTable';
import { useExtraTabContent } from 'common-util/List/ListTable/helpers';
import { getAgents, getAgentsByAccount } from './utils';

const { TabPane } = Tabs;

const MenuAgent = ({ account }) => {
  const router = useRouter();
  const { searchValue, extraTabContent, clearSearch } = useExtraTabContent({
    title: 'Agents',
    onRegisterClick: () => router.push(URL.REGISTER_AGENT),
  });

  return (
    <>
      <Tabs
        className="registry-tabs"
        type="card"
        defaultActiveKey="all"
        onChange={clearSearch}
        tabBarExtraContent={extraTabContent}
      >
        <TabPane tab="All" key="all">
          <ListTable
            type={NAV_TYPES.AGENT}
            filterValue={searchValue}
            getList={getAgents}
            onViewClick={(e) => window.console.log('View Click', e)}
          />
        </TabPane>
        <TabPane tab="My Agents" key="my_agents">
          <ListTable
            type={NAV_TYPES.AGENT}
            filterValue={searchValue}
            getList={() => getAgentsByAccount(account)}
            onViewClick={(e) => window.console.log('View Click', e)}
          />
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
