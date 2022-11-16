import { useState } from 'react';
import {
  Input, Space, Button, Typography, Tooltip,
} from 'antd/lib';
import { SearchOutlined, CopyOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import { NAV_TYPES, SERVICE_STATE, TOTAL_VIEW_COUNT } from 'util/constants';

const { Text, Title } = Typography;
const textStyle = { maxWidth: '100%' };

/**
 * helper components
 */

export const getTrimmedText = (str, suffixCount) => {
  const text = str.trim();
  const frontText = text.slice(0, suffixCount);
  const backText = text.slice(text.length - suffixCount, text.length);
  return `${frontText}...${backText}`;
};

export const EllipsisMiddle = ({ suffixCount, children, ...rest }) => {
  if (typeof children !== 'string') return <>{children}</>;

  if (children.length <= 12) return <Text {...rest}>{children}</Text>;

  /**
   * truncate only if the character exceeds more than 12
   */
  return (
    <Text style={textStyle} {...rest}>
      {getTrimmedText(children, suffixCount)}
      <Tooltip title="Copy">
        &nbsp;
        <Button
          onClick={() => navigator.clipboard.writeText(children)}
          icon={<CopyOutlined />}
        />
      </Tooltip>
    </Text>
  );
};

EllipsisMiddle.propTypes = {
  suffixCount: PropTypes.number,
  children: PropTypes.string,
};

EllipsisMiddle.defaultProps = {
  suffixCount: 6,
  children: '',
};

/**
 * helper functions
 */

export const getTableColumns = (type, { onViewClick, onUpdateClick }) => {
  if (type === NAV_TYPES.COMPONENT || type === NAV_TYPES.AGENT) {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 50,
      },
      {
        title: 'Owner',
        dataIndex: 'owner',
        key: 'owner',
        width: 160,
        render: (text) => <EllipsisMiddle>{text}</EllipsisMiddle>,
      },
      {
        title: 'Hash',
        dataIndex: 'hash',
        key: 'hash',
        width: 200,
        render: (text) => <EllipsisMiddle>{text}</EllipsisMiddle>,
      },
      {
        title: 'No. of component dependencies',
        dataIndex: 'dependency',
        width: 180,
        key: 'dependency',
      },
      {
        width: 200,
        title: 'Action',
        key: 'action',
        fixed: 'right',
        render: (_text, record) => (
          <Space size="middle">
            <Button type="link" onClick={() => onViewClick(record.id)}>
              View
            </Button>
          </Space>
        ),
      },
    ];
  }

  if (type === NAV_TYPES.SERVICE) {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 50,
        fixed: 'left',
      },
      {
        title: 'Owner',
        dataIndex: 'owner',
        key: 'owner',
        width: 200,
        render: (text) => <EllipsisMiddle>{text}</EllipsisMiddle>,
      },
      {
        title: 'State',
        dataIndex: 'state',
        key: 'state',
        width: 150,
        render: (e) => <>{SERVICE_STATE[e]}</>,
      },
      {
        width: 220,
        title: 'Action',
        key: 'action',
        fixed: 'right',
        render: (_text, record) => (
          <Space size="middle">
            <Button type="link" onClick={() => onViewClick(record.id)}>
              View
            </Button>

            {onUpdateClick && (
              <Button type="link" onClick={() => onUpdateClick(record.id)}>
                Update
              </Button>
            )}
          </Space>
        ),
      },
    ];
  }

  return [];
};

export const getData = (type, rawData, { current }) => {
  /**
   * @example
   * TOTAL_VIEW_COUNT = 10, current = 1
   * start = ((1 - 1) * 10) + 1
   *       = (0 * 10) + 1
   *       = 1
   * TOTAL_VIEW_COUNT = 10, current = 1
   * start = ((5 - 1) * 10) + 1
   *       = 40 + 1
   *       = 41
   */
  const startIndex = (current - 1) * TOTAL_VIEW_COUNT + 1;
  let data = [];
  if (type === NAV_TYPES.COMPONENT) {
    data = rawData.map((item, index) => ({
      id: item.id || `${startIndex + index}`,
      description: item.description || '-',
      developer: item.developer || '-',
      owner: item.owner || '-',
      hash: item.unitHash || '-',
      dependency: (item.dependencies || []).length,
    }));
  }

  if (type === NAV_TYPES.AGENT) {
    data = rawData.map((item, index) => ({
      id: item.id || `${startIndex + index}`,
      description: item.description || '-',
      developer: item.developer || '-',
      owner: item.owner || '-',
      hash: item.unitHash || '-',
      dependency: (item.dependencies || []).length,
    }));
  }

  if (type === NAV_TYPES.SERVICE) {
    data = rawData.map((item, index) => ({
      id: item.id || `${startIndex + index}`,
      developer: item.developer || '-',
      owner: item.owner || '-',
      active: `${item.active}`,
      state: item.state,
    }));
  }

  return data;
};

/**
 * tab content
 */
export const useExtraTabContent = ({ title, onRegisterClick = () => {} }) => {
  const [search, setSearch] = useState('');

  const clearSearch = () => setSearch('');

  const extraTabContent = {
    left: <Title level={2}>{title}</Title>,
    right: (
      <>
        <Input
          prefix={<SearchOutlined className="site-form-item-icon" />}
          placeholder="Owner or Hash"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button ghost type="primary" onClick={onRegisterClick}>
          Search
        </Button>
        <Button type="primary" onClick={onRegisterClick}>
          Register
        </Button>
      </>
    ),
  };

  return { searchValue: search, extraTabContent, clearSearch };
};
