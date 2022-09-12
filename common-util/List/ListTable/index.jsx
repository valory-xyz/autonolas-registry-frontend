import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd/lib';
import { TOTAL_VIEW_COUNT } from 'util/constants';
import { ListEmptyMessage } from 'common-util/List/ListCommon';
import Loader from 'common-util/components/Loader';
import { getData, getTableColumns } from './helpers';

const ListTable = ({
  type,
  getList,
  getTotal,
  filterValue,
  onViewClick,
  onUpdateClick,
  extra,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [list, setList] = useState([]);
  const { scrollX } = extra;

  // fetch the total first!
  useEffect(async () => {
    try {
      const totalTemp = await getTotal();
      setTotal(Number(totalTemp));
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(async () => {
    setIsLoading(true);
    setList([]);

    try {
      const everyComps = await getList(total, currentPage);
      setList(everyComps);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [total, currentPage]);

  if (isLoading) {
    return <Loader />;
  }

  const columns = getTableColumns(type, {
    onViewClick,
    onUpdateClick,
  });
  const dataSource = getData(type, list, {
    filterValue: (filterValue || '').toLowerCase(),
    current: currentPage,
  });

  return (
    <>
      {list.length === 0 ? (
        <ListEmptyMessage type={type} />
      ) : (
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{
            total,
            current: currentPage,
            defaultPageSize: TOTAL_VIEW_COUNT,
            onChange: (e) => setCurrentPage(e),
          }}
          scroll={{ x: scrollX || 1200 }}
          rowKey={(record) => `${type}-row-${record.id}`}
        />
      )}
    </>
  );
};

ListTable.propTypes = {
  type: PropTypes.string.isRequired,
  filterValue: PropTypes.string,
  getList: PropTypes.func.isRequired,
  getTotal: PropTypes.func,
  onViewClick: PropTypes.func,
  onUpdateClick: PropTypes.func,
  extra: PropTypes.shape({
    scrollX: PropTypes.number,
  }),
};

ListTable.defaultProps = {
  filterValue: null,
  getTotal: () => {},
  onViewClick: () => {},
  onUpdateClick: null,
  extra: {},
};

export default ListTable;
