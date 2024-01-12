import { useState } from 'react';
import {
  Input, Space, Button, Typography,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { AddressLink } from '@autonolas/frontend-library';

import {
  NAV_TYPES,
  SERVICE_STATE,
  SOLANA_CHAIN_NAMES,
  TOTAL_VIEW_COUNT,
} from 'util/constants';

const { Title } = Typography;

export const getTableColumns = (
  type,
  {
    onViewClick, onUpdateClick, isMobile, chainName,
  },
) => {
  if (type === NAV_TYPES.COMPONENT || type === NAV_TYPES.AGENT) {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: isMobile ? 30 : 50,
      },
      {
        title: 'Owner',
        dataIndex: 'owner',
        key: 'owner',
        width: 160,
        render: (text) => (
          <AddressLink text={text} suffixCount={isMobile ? 4 : 6} />
        ),
      },
      {
        title: 'Hash',
        dataIndex: 'hash',
        key: 'hash',
        width: 180,
        render: (text) => (
          <AddressLink text={text} suffixCount={isMobile ? 4 : 6} isIpfsLink />
        ),
      },
      {
        title: 'No. of component dependencies',
        dataIndex: 'dependency',
        width: isMobile ? 70 : 300,
        key: 'dependency',
      },
      {
        width: isMobile ? 40 : 120,
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
        width: isMobile ? 30 : 50,
      },
      {
        title: 'Owner',
        dataIndex: 'owner',
        key: 'owner',
        width: 200,
        render: (text) => {
          // TODO: move to autonolas/frontend-library
          const isSolana = chainName === SOLANA_CHAIN_NAMES.DEVNET
            || chainName === SOLANA_CHAIN_NAMES.MAINNET;

          if (isSolana) {
            return (
              <AddressLink
                text={text}
                suffixCount={isMobile ? 4 : 6}
                onClick={() => {
                  if (chainName === SOLANA_CHAIN_NAMES.DEVNET) {
                    window.open(
                      `https://solscan.io/account/${text}?cluster=devnet`,
                      '_blank',
                    );
                  } else {
                    window.open(`https://solscan.io/account/${text}`, '_blank');
                  }
                }}
              />
            );
          }

          return <AddressLink text={text} suffixCount={isMobile ? 4 : 6} />;
        },
      },
      {
        title: 'State',
        dataIndex: 'state',
        key: 'state',
        width: 150,
        render: (e) => <>{SERVICE_STATE[e]}</>,
      },
      {
        width: isMobile ? 40 : 220,
        title: 'Action',
        key: 'action',
        fixed: 'right',
        render: (_text, record) => {
          // only show update button for pre-registration state
          const canUpdate = ['1'].includes(record.state);

          return (
            <Space size="middle">
              <Button type="link" onClick={() => onViewClick(record.id)}>
                View
              </Button>

              {canUpdate && onUpdateClick && (
                <Button type="link" onClick={() => onUpdateClick(record.id)}>
                  Update
                </Button>
              )}
            </Space>
          );
        },
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
export const useExtraTabContent = ({
  title,
  onRegisterClick = () => {},
  isSvm = false,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [value, setValue] = useState('');
  const clearSearch = () => {
    setValue('');
    setSearchValue('');
  };

  const extraTabContent = {
    left: <Title level={2}>{title}</Title>,
    right: (
      <>
        {/* TODO: hiding search util feature is introduced */}
        {isSvm ? null : (
          <Input
            prefix={<SearchOutlined className="site-form-item-icon" />}
            placeholder="Owner or Hash"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        )}
        <Button
          ghost
          type="primary"
          onClick={() => setSearchValue(value || '')}
        >
          Search
        </Button>
        <Button type="primary" onClick={onRegisterClick}>
          Mint
        </Button>
      </>
    ),
  };

  return { searchValue, extraTabContent, clearSearch };
};

/**
 * returns hash from the url
 * @example
 * input: router-path (for example, /components#my-components)
 * output: my-components
 */
export const getHash = (router) => router?.asPath?.split('#')[1] || '';

/**
 * my-components/my-agents/my-serices has "my" in common hence returns
 */
export const isMyTab = (hash) => !!(hash || '').includes('my-');
