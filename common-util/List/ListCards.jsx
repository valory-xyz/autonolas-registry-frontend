import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { Card } from 'antd';
import { ListEmptyMessage, PrintJson } from 'common-util/List/ListCommon';
import Loader from 'common-util/components/Loader';

const ListCards = ({
  account, type, getList, extra,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState([]);

  useEffect(async () => {
    if (account) {
      setIsLoading(true);
      setList([]);

      try {
        const everyComps = await getList();
        setList(everyComps);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
  }, [account]);

  if (isLoading) {
    return <Loader />;
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
  const account = get(state, 'setup.account') || null;
  return { account };
};

export default connect(mapStateToProps, {})(ListCards);
