import { useState, useEffect } from 'react';
import Web3 from 'web3';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Tabs, Button, Typography, Card,
} from 'antd';
import { useRouter } from 'next/router';
import { ListEmptyMessage } from 'common-util/ListCommon';
import {
  COMPONENT_REGISTRY_ADDRESS,
  COMPONENT_REGISTRY,
} from 'common-util/AbiAndAddresses/componentRegistry';
import { EmptyMessage } from '../styles';

const { TabPane } = Tabs;
const { Title } = Typography;

const MenuComponents = ({ account }) => {
  const [list, setList] = useState([]);
  const router = useRouter();

  const handleTab = (key) => {
    console.log(key);
  };

  useEffect(() => {
    if (account) {
      window.ethereum.enable();

      const web3 = new Web3(window.web3.currentProvider);
      const contract = new web3.eth.Contract(
        COMPONENT_REGISTRY.abi,
        COMPONENT_REGISTRY_ADDRESS,
      );

      contract.methods
        .balanceOf(account)
        .call()
        .then(async (length) => {
          const promises = [];
          for (let i = 0; i < length; i += 1) {
            const element = contract.methods
              .tokenOfOwnerByIndex(account, `${i}`)
              .call();
            promises.push(element);
          }

          Promise.all(promises).then((results) => {
            setList(results);
          });
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [account]);

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
          {list.length === 0 ? (
            <ListEmptyMessage type="component" />
          ) : (
            list.map((item, index) => (
              <Card
                title={`Id: ${item}`}
                extra={null}
                key={`eachComponent-${index + 1}`}
                style={{ marginBottom: 16 }}
              >
                ..
                {/* TODO */}
                {/* {JSON.stringify(item || {})} */}
              </Card>
            ))
          )}
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
};

MenuComponents.defaultProps = {
  account: null,
};

const mapStateToProps = (state) => {
  const { account, balance } = state.setup;
  return { account, balance };
};

export default connect(mapStateToProps, {})(MenuComponents);
