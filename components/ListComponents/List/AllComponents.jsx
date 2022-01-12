import { useState, useEffect } from 'react';
import Web3 from 'web3';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, Skeleton } from 'antd';
import uniq from 'lodash/uniq';
import { ListEmptyMessage } from 'common-util/ListCommon';
import {
  COMPONENT_REGISTRY_ADDRESS,
  COMPONENT_REGISTRY,
} from 'common-util/AbiAndAddresses/componentRegistry';
import { getComponents } from '../utils';

const AllComponents = ({ account }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState([]);

  useEffect(() => {
    if (account) {
      window.ethereum.enable();
      setIsLoading(true);
      setList([]);

      const web3 = new Web3(window.web3.currentProvider);
      const contract = new web3.eth.Contract(
        COMPONENT_REGISTRY.abi,
        COMPONENT_REGISTRY_ADDRESS,
      );

      contract.methods
        .totalSupply()
        .call()
        .then((total) => {
          const ownersListPromises = [];
          for (let i = 1; i <= total; i += 1) {
            const componentId = `${i}`;
            const result = contract.methods.ownerOf(componentId).call();
            ownersListPromises.push(result);
          }

          Promise.all(ownersListPromises).then(async (ownersList) => {
            const uniqueOwners = uniq(ownersList);
            const allComponentsPromises = [];
            for (let i = 0; i < uniqueOwners.length; i += 1) {
              const compInfo = getComponents(uniqueOwners[i]);
              allComponentsPromises.push(compInfo);
            }

            Promise.all(allComponentsPromises).then((allComponentsList) => {
              setIsLoading(false);
              setList(...allComponentsList);
            });
          });
        })
        .catch((e) => {
          console.error(e); /* eslint-disable-line no-console */
        });
    }
  }, [account]);

  if (isLoading) {
    return <Skeleton active />;
  }

  return (
    <>
      {list.length === 0 ? (
        <ListEmptyMessage type="component" />
      ) : (
        list.map((item, index) => (
          <Card
            title={`Id: ${index + 1}`}
            extra={null}
            key={`allComponent-${index + 1}`}
            style={{ marginBottom: 16 }}
          >
            <pre>{JSON.stringify(item || {}, null, 2)}</pre>
          </Card>
        ))
      )}
    </>
  );
};

AllComponents.propTypes = {
  account: PropTypes.string,
};

AllComponents.defaultProps = {
  account: null,
};

const mapStateToProps = (state) => {
  const { account, balance } = state.setup;
  return { account, balance };
};

export default connect(mapStateToProps, {})(AllComponents);
