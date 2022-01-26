import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Tabs, Button, Typography, Table, Input,
} from 'antd';
import { useRouter } from 'next/router';
import { URL } from 'util/constants';
import ListCards from 'common-util/List/ListCards';
import { getComponents, getComponentsByAccount } from './utils';
import { getTableColumns, getData } from './tableHelpers';

const { TabPane } = Tabs;
const { Title } = Typography;
const { Search } = Input;

const ListComponents = ({ account }) => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState([]);

  useEffect(async () => {
    if (account) {
      window.ethereum.enable();
      setIsLoading(true);
      setList([]);

      try {
        const everyComps = await getComponents();
        setList(everyComps);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
  }, [account]);

  return (
    <>
      <Tabs
        className="registry-tabs"
        type="card"
        defaultActiveKey="all"
        tabBarExtraContent={{
          left: <Title level={2}>Components</Title>,
          right: (
            <>
              <Search
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <Button
                ghost
                type="primary"
                onClick={() => router.push(URL.REGISTER_COMPONENT)}
              >
                Register
              </Button>
            </>
          ),
        }}
      >
        <TabPane tab="All" key="all">
          <div style={{ display: 'none' }}>
            <ListCards type="component" getList={getComponents} />
          </div>
          <Table
            columns={getTableColumns({ handleView: () => {} })}
            dataSource={getData(list)}
            scroll={{ x: 100 }}
            // scroll={{ y: 20 }}
            loading={isLoading}
          />
        </TabPane>

        <TabPane tab="My Components" key="my_components">
          <ListCards
            type="component"
            getList={() => getComponentsByAccount(account)}
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
