import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tabs, Button, Typography } from 'antd';
import { useRouter } from 'next/router';
import { URL } from 'util/constants';
import ListCards from 'common-util/List/ListCards';
import { getComponents, getComponentsByAccount } from './utils';

const { TabPane } = Tabs;
const { Title } = Typography;

const ListComponents = ({ account }) => {
  const router = useRouter();

  return (
    <>
      <Title level={2}>Components</Title>
      <Tabs
        type="card"
        defaultActiveKey="all"
        tabBarExtraContent={(
          <Button
            ghost
            type="primary"
            onClick={() => router.push(URL.REGISTER_COMPONENT)}
          >
            Register
          </Button>
        )}
      >
        <TabPane tab="All" key="all">
          <ListCards type="component" getList={getComponents} />
        </TabPane>
        <TabPane tab="My Components" key="my_components">
          <ListCards type="component" getList={() => getComponentsByAccount(account)} />
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
