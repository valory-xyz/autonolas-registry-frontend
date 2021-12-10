import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tabs, Button, Typography } from 'antd';
import { useRouter } from 'next/router';
import { EmptyMessage } from '../styles';

const { TabPane } = Tabs;
const { Title } = Typography;

const MenuServices = ({ account }) => {
  const router = useRouter();

  const handleTab = (key) => {
    console.log(key);
  };

  return (
    <>
      <Title level={2}>Services</Title>
      <Tabs
        type="card"
        defaultActiveKey="all"
        onChange={handleTab}
        tabBarExtraContent={(
          <Button
            ghost
            type="primary"
            onClick={() => router.push('/services/register')}
          >
            Register
          </Button>
        )}
      >
        <TabPane tab="All" key="all">
          <EmptyMessage>No services registered</EmptyMessage>
        </TabPane>
        <TabPane tab="My Services" key="my_services">
          {account ? (
            <EmptyMessage>No services registered</EmptyMessage>
          ) : (
            <EmptyMessage width="180px">
              To see your services, connect a wallet.
            </EmptyMessage>
          )}
        </TabPane>
      </Tabs>
    </>
  );
};

MenuServices.propTypes = {
  account: PropTypes.string,
};

MenuServices.defaultProps = {
  account: null,
};

const mapStateToProps = (state) => {
  const { account } = state.setup;
  return { account };
};

export default connect(mapStateToProps, {})(MenuServices);
