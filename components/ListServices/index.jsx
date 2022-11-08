import { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs } from 'antd/lib';
import { useRouter } from 'next/router';
import { URL, NAV_TYPES } from 'util/constants';
import ListTable from 'common-util/List/ListTable';
import { useExtraTabContent } from 'common-util/List/ListTable/helpers';
import { getMyListOnPagination } from 'common-util/ContractUtils/myList';
import {
  getServices,
  getServicesByAccount,
  getTotalForAllServices,
  getTotalForMyServices,
} from './utils';

const { TabPane } = Tabs;

const ListServices = ({ account }) => {
  const router = useRouter();
  const { searchValue, extraTabContent, clearSearch } = useExtraTabContent({
    title: 'Services',
    onRegisterClick: () => router.push(URL.REGISTER_SERVICE),
  });

  const commonProps = {
    type: NAV_TYPES.SERVICE,
    filterValue: searchValue,
    onViewClick: (id) => router.push(`${URL.SERVICES}/${id}`),
  };

  // my services
  const [myServicesList, setMyServicesList] = useState([]);
  const getMyServicesApi = async () => {
    const e = await getServicesByAccount(account);
    setMyServicesList(e);
    return e;
  };

  const getMyServices = async (myComponentsTotal, nextPage) => getMyListOnPagination({
    total: myComponentsTotal,
    nextPage,
    myList: myServicesList,
    getMyList: getMyServicesApi,
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
            {...commonProps}
            getList={getServices}
            getTotal={getTotalForAllServices}
          />
        </TabPane>
        <TabPane tab="My Services" key="my_services">
          <ListTable
            {...commonProps}
            getList={getMyServices}
            getTotal={() => getTotalForMyServices(account)}
            onUpdateClick={(serviceId) => router.push(`${URL.UPDATE_SERVICE}/${serviceId}`)}
            isAccountRequired
          />
        </TabPane>
      </Tabs>
    </>
  );
};

ListServices.propTypes = {
  account: PropTypes.string,
};

ListServices.defaultProps = {
  account: null,
};

const mapStateToProps = (state) => {
  const { account } = state.setup;
  return { account };
};

export default connect(mapStateToProps, {})(ListServices);

/**
 * service-registry is used for readonly
 * otherwise use service-manager
 */
