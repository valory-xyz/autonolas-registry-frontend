import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, Skeleton } from 'antd';
import { ListEmptyMessage } from 'common-util/ListCommon';
import { getEveryComponents } from '../utils';

const AllComponents = ({ account }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState([]);

  useEffect(async () => {
    if (account) {
      window.ethereum.enable();
      setIsLoading(true);
      setList([]);

      try {
        const everyComps = await getEveryComponents();
        setList(everyComps);
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
