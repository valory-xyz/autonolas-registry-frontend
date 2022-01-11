/* eslint-disable no-console */
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Tabs, Button, Typography, Card, Skeleton,
} from 'antd';
import { useRouter } from 'next/router';
import { ListEmptyMessage, PrintJson } from 'common-util/ListCommon';
import {
  SERVICE_REGISTRY_ADDRESS,
  SERVICE_REGISTRY,
} from 'common-util/AbiAndAddresses/serviceRegistry';
import { EmptyMessage } from '../styles';

const { TabPane } = Tabs;
const { Title } = Typography;

const MenuServices = ({ account }) => {
  const [isServicesListLoading, setServicesListLoading] = useState(false);
  const [list, setList] = useState([]);
  const router = useRouter();

  const handleTab = (key) => {
    console.log(key);
  };

  useEffect(() => {
    if (account) {
      window.ethereum.enable();
      setServicesListLoading(true);
      setList([]);

      const web3 = new Web3(window.web3.currentProvider);
      const contract = new web3.eth.Contract(
        SERVICE_REGISTRY.abi,
        SERVICE_REGISTRY_ADDRESS,
      );

      contract.methods
        .balanceOf(account)
        .call()
        .then(async (length) => {
          const promises = [];
          for (let i = 1; i <= length; i += 1) {
            const componentId = `${i}`;
            const result = contract.methods.getServiceInfo(componentId).call();
            promises.push(result);
          }

          Promise.all(promises).then((results) => {
            setServicesListLoading(false);
            setList(results);
          });
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [account]);

  const getAllTabDetails = () => {
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
          {getAllTabDetails()}
        </TabPane>
        <TabPane tab="My Services" key="my_services">
          {account ? (
            <ListEmptyMessage type="service" />
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

/**
 * totalSupply() & then loop it through
 *
 * then call OwnerOf => create map => can also call balanceOf or getServiceOfOwners
 * => will return set of IDs => loop through
 *
 * {
 *   address: 0
 * }
 */
