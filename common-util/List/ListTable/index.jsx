import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, Skeleton } from 'antd/dist/antd';
import { ListEmptyMessage } from 'common-util/List/ListCommon';
import { getData, getTableColumns } from './helpers';

const ListTable = ({
  account,
  type,
  getList,
  filterValue,
  onViewClick,
  onUpdateClick,
  onDeleteClick,
  extra,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState([]);
  const { scrollX } = extra;

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
    return <Skeleton active />;
  }

  return (
    <>
      {list.length === 0 ? (
        <ListEmptyMessage type={type} />
      ) : (
        <Table
          columns={getTableColumns(type, { onViewClick, onUpdateClick, onDeleteClick })}
          dataSource={getData(type, list, {
            filterValue: (filterValue || '').toLowerCase(),
          })}
          pagination={false}
          scroll={{ x: scrollX || 1200 }}
          rowKey={(record) => `${type}-row-${record.id}`}
          // scroll={{ y: 20 }}
        />
      )}
    </>
  );
};

ListTable.propTypes = {
  account: PropTypes.string,
  type: PropTypes.string.isRequired,
  filterValue: PropTypes.string,
  getList: PropTypes.func.isRequired,
  onViewClick: PropTypes.func,
  onUpdateClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  extra: PropTypes.shape({
    scrollX: PropTypes.number,
  }),
};

ListTable.defaultProps = {
  account: null,
  filterValue: null,
  onViewClick: () => {},
  onUpdateClick: null,
  onDeleteClick: () => {},
  extra: {},
};

const mapStateToProps = (state) => {
  const { account } = state.setup;
  return { account };
};

export default connect(mapStateToProps, {})(ListTable);
