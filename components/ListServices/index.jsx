import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tabs } from 'antd/dist/antd';
import { useRouter } from 'next/router';
import { URL, NAV_TYPES } from 'util/constants';
import ListTable from 'common-util/List/ListTable';
import { useExtraTabContent } from 'common-util/List/ListTable/helpers';
import { getServices, getServicesByAccount } from './utils';

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
            onDeleteClick={(e) => window.console.log('Delete Click', e)}
          />
        </TabPane>
        <TabPane tab="My Services" key="my_services">
          <ListTable
            {...commonProps}
            getList={() => getServicesByAccount(account)}
            onUpdateClick={(serviceId) => router.push(`${URL.UPDATE_SERVICE}/${serviceId}`)}
            onDeleteClick={(e) => window.console.log('Delete Click', e)}
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
