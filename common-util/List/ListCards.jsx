import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, Skeleton } from 'antd';
import { ListEmptyMessage, PrintJson } from 'common-util/ListCommon';

const ListCards = ({
  account, type, getList, extra,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState([]);

  useEffect(async () => {
    if (account) {
      window.ethereum.enable();
      setIsLoading(true);
      setList([]);

      try {
        const everyComps = await getList();
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
        <ListEmptyMessage type={type} />
      ) : (
        list.map((item, index) => (
          <Card
            title={`Id: ${index + 1}`}
            extra={extra}
            key={`${type}-${index + 1}`}
            style={{ marginBottom: 16 }}
          >
            <PrintJson value={item} />
          </Card>
        ))
      )}
    </>
  );
};

ListCards.propTypes = {
  account: PropTypes.string,
  extra: PropTypes.element,
  type: PropTypes.string.isRequired,
  getList: PropTypes.func.isRequired,
};

ListCards.defaultProps = {
  account: null,
  extra: null,
};

const mapStateToProps = (state) => {
  const { account } = state.setup;
  return { account };
};

export default connect(mapStateToProps, {})(ListCards);
