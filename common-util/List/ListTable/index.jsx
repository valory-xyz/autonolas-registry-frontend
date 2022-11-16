import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd/lib';
import { useSelector } from 'react-redux';
import get from 'lodash/get';
import { TOTAL_VIEW_COUNT } from 'util/constants';
import { ListEmptyMessage } from 'common-util/List/ListCommon';
import Loader from 'common-util/components/Loader';
import { getData, getTableColumns } from './helpers';

const ListTable = ({
  type,
  getList,
  getTotal,
  onViewClick,
  onUpdateClick,
  extra,
  isAccountRequired,
}) => {
  const account = useSelector((state) => get(state, 'setup.account'));
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [list, setList] = useState([]);
  const { scrollX } = extra;
  const canCallApi = isAccountRequired ? !!account : true;

  // fetch the total first!
  useEffect(() => {
    (async () => {
      if (canCallApi) {
        try {
          const totalTemp = await getTotal();
          setTotal(Number(totalTemp));
          if (Number(totalTemp) === 0) setIsLoading(false);
        } catch (e) {
          console.error(e);
        }
      }
    })();
  }, [account]);

  useEffect(() => {
    (async () => {
      if (total && currentPage && canCallApi) {
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
      }
    })();
  }, [account, total, currentPage]);

  if (isLoading) {
    return (
      <Loader
        isAccountRequired={isAccountRequired}
        message={
          isAccountRequired ? `To see your ${type}s, connect wallet` : ''
        }
      />
    );
  }

  const columns = getTableColumns(type, {
    onViewClick,
    onUpdateClick,
  });
  const dataSource = getData(type, list, {
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
  getList: PropTypes.func.isRequired,
  getTotal: PropTypes.func,
  onViewClick: PropTypes.func,
  onUpdateClick: PropTypes.func,
  isAccountRequired: PropTypes.bool,
  extra: PropTypes.shape({
    scrollX: PropTypes.number,
  }),
};

ListTable.defaultProps = {
  getTotal: () => {},
  onViewClick: () => {},
  onUpdateClick: null,
  extra: {},
  isAccountRequired: false,
};

export default ListTable;
