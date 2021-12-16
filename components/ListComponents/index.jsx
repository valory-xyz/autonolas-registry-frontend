import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tabs, Button, Typography } from 'antd';
import { useRouter } from 'next/router';
import { ListEmptyMessage } from 'common-util/ListCommon';
import { EmptyMessage } from '../styles';

const { TabPane } = Tabs;
const { Title } = Typography;

const MenuComponents = ({ account, balance }) => {
  const router = useRouter();

  const handleTab = (key) => {
    console.log(key);
  };

  // TODO: remove later
  console.log({ account, balance });

  return (
    <>
      <Title level={2}>Components</Title>
      <Tabs
        type="card"
        defaultActiveKey="all"
        onChange={handleTab}
        tabBarExtraContent={(
          <Button
            ghost
            type="primary"
            onClick={() => router.push('/components/register')}
          >
            Register
          </Button>
        )}
      >
        <TabPane tab="All" key="all">
          <ListEmptyMessage type="component" />
        </TabPane>
        <TabPane tab="My Components" key="my_components">
          {account ? (
            <ListEmptyMessage type="component" />
          ) : (
            <EmptyMessage width="200px">
              To see your components, connect a wallet.
            </EmptyMessage>
          )}
        </TabPane>
      </Tabs>
    </>
  );
};

MenuComponents.propTypes = {
  account: PropTypes.string,
  balance: PropTypes.string,
};

MenuComponents.defaultProps = {
  account: null,
  balance: null,
};

const mapStateToProps = (state) => {
  const { account, balance } = state.setup;
  return { account, balance };
};

export default connect(mapStateToProps, {})(MenuComponents);
