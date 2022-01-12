import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, Skeleton } from 'antd';
import { ListEmptyMessage } from 'common-util/ListCommon';
import { getComponents } from '../utils';

const MyComponents = ({ account }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState([]);

  useEffect(async () => {
    if (account) {
      window.ethereum.enable();
      setIsLoading(true);
      setList([]);

      try {
        const myComps = await getComponents(account);
        setList(myComps);
      } catch (e) {
        console.error(e); /* eslint-disable-line no-console */
      } finally {
        setIsLoading(false);
      }
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
            key={`myComponent-${index + 1}`}
            style={{ marginBottom: 16 }}
          >
            <pre>{JSON.stringify(item || {}, null, 2)}</pre>
          </Card>
        ))
      )}
    </>
  );
};

MyComponents.propTypes = {
  account: PropTypes.string,
};

MyComponents.defaultProps = {
  account: null,
};

const mapStateToProps = (state) => {
  const { account, balance } = state.setup;
  return { account, balance };
};

export default connect(mapStateToProps, {})(MyComponents);
