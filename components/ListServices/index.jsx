import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Tabs, Button, Typography, Card, Skeleton,
} from 'antd';
import { useRouter } from 'next/router';
import { ListEmptyMessage, PrintJson } from 'common-util/ListCommon';
import ListCards from 'common-util/List/ListCards';
import { getEveryServices, getServices } from './utils';

const { TabPane } = Tabs;
const { Title } = Typography;

const ListServices = ({ account }) => {
  const [isServicesListLoading, setServicesListLoading] = useState(false);
  const [list, setList] = useState([]);
  const router = useRouter();

  useEffect(async () => {
    if (account) {
      window.ethereum.enable();
      setServicesListLoading(true);
      setList([]);

      try {
        const everyService = await getServices(account);
        setList(everyService);
      } catch (e) {
        console.error(e);
      } finally {
        setServicesListLoading(false);
      }
    }
  }, [account]);

  const getMyServices = () => {
    if (isServicesListLoading) {
      return <Skeleton active />;
    }

    return (
      <>
        {list.length === 0 ? (
          <ListEmptyMessage type="service" />
        ) : (
          list.map((item, index) => {
            const serviceId = index + 1;
            return (
              <Card
                title={`Id: ${serviceId}`}
                extra={(
                  <Button
                    ghost
                    type="primary"
                    onClick={() => router.push(`/services/${serviceId}`)}
                  >
                    Update
                  </Button>
                )}
                key={`eachService-${index + 1}`}
                style={{ marginBottom: 16 }}
              >
                <PrintJson value={item} />
              </Card>
            );
          })
        )}
      </>
    );
  };

  return (
    <>
      <Title level={2}>Services</Title>
      <Tabs
        type="card"
        defaultActiveKey="all"
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
          <ListCards type="service" getList={getEveryServices} />
        </TabPane>
        <TabPane tab="My Services" key="my_services">
          {getMyServices()}
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
