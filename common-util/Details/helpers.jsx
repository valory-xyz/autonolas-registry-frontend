import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from 'antd/lib';
import { GATEWAY_URL } from 'util/constants';
import { getIpfsHashFromBytes32 } from '../List/ListCommon';
import { getServiceTableDataSource } from './ServiceState/utils';

export const COLUMNS = [
  {
    title: 'Agent ID',
    dataIndex: 'agentId',
    key: 'agentId',
  },
  {
    title: 'Slots',
    dataIndex: 'agentNumSlots',
    key: 'agentNumSlots',
  },
  {
    title: 'Bond Cost',
    dataIndex: 'bonds',
    key: 'bonds',
  },
];

/**
 * helper function to generate table
 */
export const ServiceMiniTable = ({ id, agentIds, onDependencyClick }) => {
  const [source, setSource] = useState([]);

  useEffect(async () => {
    if (id && (agentIds || []).length !== 0) {
      const temp = await getServiceTableDataSource(id, agentIds || []);
      setSource(temp);
    }
  }, [id, agentIds]);

  const data = source.map(({ agentId, bond, availableSlots }, index) => ({
    id: `table-row-${index}`,
    agentId: (
      <Button type="link" onClick={() => onDependencyClick(agentId)}>
        {agentId}
      </Button>
    ),
    agentNumSlots: availableSlots,
    bonds: bond,
  }));

  return (
    <Table
      dataSource={data}
      columns={COLUMNS}
      pagination={false}
      rowKey={(record) => record.id}
    />
  );
};

ServiceMiniTable.propTypes = {
  id: PropTypes.string.isRequired,
  agentIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onDependencyClick: PropTypes.func.isRequired,
};

const pattern = /https:\/\/localhost\/(agent|component|service)\/+/g;

export const getAutonolasTokenUri = (tokenUri) => (tokenUri || '').replace(pattern, GATEWAY_URL);

export const getHashDetails = (type, hash, tokenUri) => {
  const updatedTokenUri = getAutonolasTokenUri(tokenUri);
  return (
    <>
      {hash.length === 0 ? (
        <div>
          <a href={updatedTokenUri} target="_blank" rel="noopener noreferrer">
            {updatedTokenUri}
          </a>
        </div>
      ) : (
        <>
          {hash.map((e, index) => (
            <li key={`${type}-hashes-${index}`}>{getIpfsHashFromBytes32(e)}</li>
          ))}
        </>
      )}
    </>
  );
};
