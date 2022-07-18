import { useState } from 'react';
import {
  Input, Space, Button, Typography,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import some from 'lodash/some';
import includes from 'lodash/includes';
import { NAV_TYPES, SERVICE_STATE } from 'util/constants';

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
        render: (text) => <EllipsisMiddle>{text}</EllipsisMiddle>,
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
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 160,
        render: (text) => <EllipsisMiddle>{text}</EllipsisMiddle>,
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
        width: 100,
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
      hash: item.unitHash || '-',
      dependency: item.dependencies.length,
    }));
  }

  if (type === NAV_TYPES.AGENT) {
    data = rawData.map((item, index) => ({
      id: `${index + 1}`,
      description: item.description || '-',
      developer: item.developer || '-',
      owner: item.owner || '-',
      hash: item.unitHash || '-',
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
      state: item.state,
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
