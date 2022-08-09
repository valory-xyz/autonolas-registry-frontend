import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd/lib';
import { ListEmptyMessage } from 'common-util/List/ListCommon';
import Loader from 'common-util/components/Loader';
import { getData, getTableColumns } from './helpers';

const ListTable = ({
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
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  const columns = getTableColumns(type, {
    onViewClick,
    onUpdateClick,
    onDeleteClick,
  });
  const dataSource = getData(type, list, {
    filterValue: (filterValue || '').toLowerCase(),
  });

  return (
    <>
      {list.length === 0 ? (
        <ListEmptyMessage type={type} />
      ) : (
        <Table
          columns={columns}
          dataSource={dataSource}
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
  filterValue: null,
  onViewClick: () => {},
  onUpdateClick: null,
  onDeleteClick: () => {},
  extra: {},
};

export default ListTable;
