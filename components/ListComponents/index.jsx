import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tabs } from 'antd/lib';
import { useRouter } from 'next/router';
import { URL, NAV_TYPES } from 'util/constants';
import ListTable from 'common-util/List/ListTable';
import { useExtraTabContent } from 'common-util/List/ListTable/helpers';
import {
  getComponents,
  getComponentsByAccount,
  getTotalForAllComponents,
  getTotalForMyComponents,
} from './utils';

const { TabPane } = Tabs;

const ListComponents = ({ account }) => {
  const router = useRouter();
  const { searchValue, extraTabContent, clearSearch } = useExtraTabContent({
    title: 'Components',
    onRegisterClick: () => router.push(URL.REGISTER_COMPONENT),
  });

  const onViewClick = (id) => router.push(`${URL.COMPONENTS}/${id}`);

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
            type={NAV_TYPES.COMPONENT}
            getList={getComponents}
            filterValue={searchValue}
            onViewClick={onViewClick}
            getTotal={getTotalForAllComponents}
          />
        </TabPane>

        <TabPane tab="My Components" key="my_components">
          <ListTable
            type={NAV_TYPES.COMPONENT}
            getList={getComponentsByAccount}
            filterValue={searchValue}
            onViewClick={onViewClick}
            getTotal={() => getTotalForMyComponents(account)}
            isAccountRequired
          />
        </TabPane>
      </Tabs>
    </>
  );
};

ListComponents.propTypes = {
  account: PropTypes.string,
};

ListComponents.defaultProps = {
  account: null,
};

const mapStateToProps = (state) => {
  const { account } = state.setup;
  return { account };
};

export default connect(mapStateToProps, {})(ListComponents);
