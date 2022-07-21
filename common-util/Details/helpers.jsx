import { Table, Button } from 'antd/lib';
import get from 'lodash/get';
import { getAgentSlots, getBonds } from 'components/ListServices/RegisterForm';
import { getIpfsHashFromBytes32 } from '../List/ListCommon';

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
export const getTable = (info, { onDependencyClick }) => {
  const dependencies = get(info, 'agentIds') || [];
  const agentSlots = getAgentSlots(info);
  const bonds = getBonds(info);

  const data = dependencies.map((e, index) => ({
    id: `table-row-${e}`,
    agentId: (
      <Button type="link" onClick={() => onDependencyClick(e)}>
        {e}
      </Button>
    ),
    agentNumSlots: agentSlots[index],
    bonds: bonds[index],
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

export const getHashDetails = (type, hash, tokenUri) => (
  <>
    {hash.length === 0 ? (
      <div>
        <a href={tokenUri} target="_blank" rel="noopener noreferrer">
          {tokenUri}
        </a>
      </div>
    ) : (
      <>
        {hash.map((e, index) => (
          <li key={`${type}-hashes-${index}`}>
            {getIpfsHashFromBytes32(e)}
          </li>
        ))}
      </>
    )}
  </>
);
