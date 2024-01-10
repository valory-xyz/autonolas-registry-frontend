import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { Loader, useScreen } from '@autonolas/frontend-library';

import { TOTAL_VIEW_COUNT } from 'util/constants';
import { ListEmptyMessage } from 'common-util/List/ListCommon';
import { getData, getTableColumns } from './helpers';

const ListTable = ({
  isLoading,
  type,
  searchValue,
  list,
  total,
  currentPage,
  setCurrentPage,
  isAccountRequired,
  onViewClick,
  onUpdateClick,
  extra,
}) => {
  const chainName = useSelector((state) => state.setup.chainName);
  /**
   * no pagination on search as we won't know total beforehand
   */
  const isPaginationRequired = !searchValue;
  const { isMobile } = useScreen();

  const { scrollX } = extra;

  if (isLoading) {
    return (
      <Loader
        isAccountRequired={isAccountRequired}
        notConnectedMessage={
          isAccountRequired ? `To see your ${type}s, connect wallet` : ''
        }
      />
    );
  }

  const columns = getTableColumns(type, {
    onViewClick,
    onUpdateClick,
    isMobile,
    chainName,
  });
  const dataSource = getData(type, list, { current: currentPage });
  const pagination = {
    total,
    current: currentPage,
    defaultPageSize: TOTAL_VIEW_COUNT,
    onChange: (e) => setCurrentPage(e),
    showSizeChanger: false,
  };

  return (
    <>
      {list.length === 0 ? (
        <ListEmptyMessage type={type} />
      ) : (
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={isPaginationRequired ? pagination : false}
          scroll={{ x: scrollX || 1200 }}
          rowKey={(record) => `${type}-row-${record.id}`}
        />
      )}
    </>
  );
};

ListTable.propTypes = {
  type: PropTypes.string.isRequired,
  searchValue: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  list: PropTypes.arrayOf(PropTypes.object),
  total: PropTypes.number,
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func,
  isAccountRequired: PropTypes.bool,
  onViewClick: PropTypes.func,
  onUpdateClick: PropTypes.func,
  extra: PropTypes.shape({ scrollX: PropTypes.number }),
};

ListTable.defaultProps = {
  isLoading: false,
  list: [],
  total: 0,
  currentPage: 0,
  setCurrentPage: () => {},
  isAccountRequired: false,
  onViewClick: () => {},
  onUpdateClick: null,
  extra: {},
};

export default ListTable;
