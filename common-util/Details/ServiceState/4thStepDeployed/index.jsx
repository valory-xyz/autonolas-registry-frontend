import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, Space } from 'antd/lib';
import { Address } from 'common-util/styles';
import { getAgentInstanceAndOperator } from '../utils';

const columns = [
  {
    title: 'Agent Instances',
    dataIndex: 'agentInstance',
    key: 'agentInstance',
    render: (text) => <Address width={260}>{text}</Address>,
  },
  {
    title: 'Operators',
    dataIndex: 'operatorAddress',
    key: 'operatorAddress',
    render: (text) => <Address width={260}>{text}</Address>,
  },
];

const Deployed = ({ serviceId, multisig, terminateButton }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      if (serviceId) {
        const tempData = await getAgentInstanceAndOperator(serviceId);
        setData(tempData);
      }
    })();
  }, [serviceId]);

  return (
    <div className="step-4-terminate">
      <Space direction="vertical" size={10}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered
          rowKey="id"
        />
        <div>{`Safe contract address: ${multisig}`}</div>
        {terminateButton}
      </Space>
    </div>
  );
};

Deployed.propTypes = {
  serviceId: PropTypes.string,
  multisig: PropTypes.string.isRequired,
  terminateButton: PropTypes.element.isRequired,
};

Deployed.defaultProps = {
  serviceId: null,
};

export default Deployed;
