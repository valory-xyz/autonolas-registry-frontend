import { useState } from 'react';
import {
  Input, Space, Button, Typography,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import some from 'lodash/some';
import includes from 'lodash/includes';
import { NAV_TYPES } from 'util/constants';

const { Text, Title } = Typography;
const textStyle = { maxWidth: '100%' };

/**
 * helper components
 */

// TODO: need to update: https://trello.com/c/ChbJiG5b/354-protocol-frontend-redesign-after-camelia-design-is-ready
export const EllipsisMiddle = ({ suffixCount, children }) => {
  let start = null;
  let suffix = 0;

  if (children.length > 10) {
    start = children.slice(0, children.length - suffixCount).trim();
    suffix = children.slice(-suffixCount).trim();
  } else {
    start = children;
    suffix = null;
  }

  return (
    <Text style={textStyle} ellipsis={{ suffix }}>
      {start}
    </Text>
  );
};

EllipsisMiddle.propTypes = {
  suffixCount: PropTypes.number,
  children: PropTypes.string,
};

EllipsisMiddle.defaultProps = {
  suffixCount: 0,
  children: '',
};

/**
 * helper functions
 */
export const getTableColumns = (
  type,
  { onViewClick, onUpdateClick, onDeleteClick },
) => {
  if (type === NAV_TYPES.COMPONENT || type === NAV_TYPES.AGENT) {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 50,
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: 200,
        className: 'underline',
        render: (text) => (
          <EllipsisMiddle suffixCount={5}>{text}</EllipsisMiddle>
        ),
      },
      {
        title: 'Developer',
        dataIndex: 'developer',
        key: 'developer',
        width: 200,
        render: (text) => (
          <EllipsisMiddle suffixCount={5}>{text}</EllipsisMiddle>
        ),
      },
      {
        title: 'Owner',
        dataIndex: 'owner',
        key: 'owner',
        width: 160,
        render: (text) => (
          <EllipsisMiddle suffixCount={5}>{text}</EllipsisMiddle>
        ),
      },
      {
        title: 'Hash',
        dataIndex: 'hash',
        key: 'hash',
        width: 200,
        render: (text) => (
          <EllipsisMiddle suffixCount={5}>{text.hash}</EllipsisMiddle>
        ),
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
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 160,
        render: (text) => (
          <EllipsisMiddle suffixCount={5}>{text}</EllipsisMiddle>
        ),
      },
      {
        title: 'Developer',
        dataIndex: 'developer',
        key: 'developer',
        width: 200,
        render: (text) => (
          <EllipsisMiddle suffixCount={5}>{text}</EllipsisMiddle>
        ),
      },
      {
        title: 'Owner',
        dataIndex: 'owner',
        key: 'owner',
        width: 200,
        render: (text) => (
          <EllipsisMiddle suffixCount={5}>{text}</EllipsisMiddle>
        ),
      },
      {
        title: 'Active',
        dataIndex: 'active',
        key: 'active',
        width: 100,
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

            <Button
              type="link"
              disabled
              onClick={() => onDeleteClick(record.id)}
            >
              Delete
            </Button>
          </Space>
        ),
      },
    ];
  }

  return [];
};

export const getData = (type, rawData, { filterValue }) => {
  let data = [];
  if (type === NAV_TYPES.COMPONENT) {
    data = rawData.map((item, index) => ({
      id: `${index + 1}`,
      description: item.description || '-',
      developer: item.developer || '-',
      owner: item.owner || '-',
      hash: item.componentHash || '-',
      dependency: item.dependencies.length,
    }));
  }

  if (type === NAV_TYPES.AGENT) {
    data = rawData.map((item, index) => ({
      id: `${index + 1}`,
      description: item.description || '-',
      developer: item.developer || '-',
      owner: item.owner || '-',
      hash: item.agentHash || '-',
      dependency: item.dependencies.length,
    }));
  }

  if (type === NAV_TYPES.SERVICE) {
    data = rawData.map((item, index) => ({
      id: `${index + 1}`,
      name: item.name || '-',
      developer: item.developer || '-',
      owner: item.owner || '-',
      active: `${item.active}`,
    }));
  }

  /* Filtering based on search value */
  // If no filterValue, return original data
  if (!filterValue) return data;

  // filter any substring in table
  data = data.filter((item) => some(item, (eachProperty) => {
    // eg. dependencies is an array
    if (Array.isArray(eachProperty)) {
      return includes(eachProperty.join(', ').toLowerCase(), filterValue);
    }
    return includes((eachProperty || '').toLowerCase(), filterValue);
  }));

  return data;
};

//
export const useExtraTabContent = ({ title, onRegisterClick = () => {} }) => {
  const [search, setSearch] = useState('');

  const clearSearch = () => setSearch('');

  const extraTabContent = {
    left: <Title level={2}>{title}</Title>,
    right: (
      <>
        <Input
          prefix={<SearchOutlined className="site-form-item-icon" />}
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button ghost type="primary" onClick={onRegisterClick}>
          Register
        </Button>
      </>
    ),
  };

  return { searchValue: search, extraTabContent, clearSearch };
};
