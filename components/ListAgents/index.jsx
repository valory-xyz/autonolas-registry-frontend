// import PropTypes from 'prop-types';
import { useState } from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd/lib';
import { accountProptype } from 'common-util/Proptype';
import { useRouter } from 'next/router';
import { URL, NAV_TYPES } from 'util/constants';
import ListTable from 'common-util/List/ListTable';
import { useExtraTabContent } from 'common-util/List/ListTable/helpers';
import { getMyListOnPagination } from 'common-util/ContractUtils/myList';
import {
  getAgents,
  getAgentsByAccount,
  getTotalForAllAgents,
  getTotalForMyAgents,
} from './utils';

const { TabPane } = Tabs;

const ListAgents = ({ account }) => {
  const router = useRouter();
  const { searchValue, extraTabContent, clearSearch } = useExtraTabContent({
    title: 'Agents',
    onRegisterClick: () => router.push(URL.REGISTER_AGENT),
  });

  const onViewClick = (id) => router.push(`${URL.AGENTS}/${id}`);

  // my components
  const [myComponentsList, setMyComponentsList] = useState([]);
  const getMyComponentsApi = async () => {
    const e = await getAgentsByAccount(account);
    setMyComponentsList(e);
    return e;
  };

  const getMyAgents = async (myComponentsTotal, nextPage) => getMyListOnPagination({
    total: myComponentsTotal,
    nextPage,
    myList: myComponentsList,
    getMyList: getMyComponentsApi,
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
            onViewClick={onViewClick}
            getTotal={getTotalForAllAgents}
          />
        </TabPane>
        <TabPane tab="My Agents" key="my_agents">
          <ListTable
            type={NAV_TYPES.AGENT}
            filterValue={searchValue}
            getList={getMyAgents}
            onViewClick={onViewClick}
            getTotal={() => getTotalForMyAgents(account)}
            isAccountRequired
          />
        </TabPane>
      </Tabs>
    </>
  );
};

ListAgents.propTypes = {
  account: accountProptype,
};

ListAgents.defaultProps = {
  account: null,
};

const mapStateToProps = (state) => {
  const { account } = state.setup;
  return { account };
};

export default connect(mapStateToProps, {})(ListAgents);
