import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Table, Space } from 'antd/lib';
import get from 'lodash/get';
import { Address } from 'common-util/styles';
import { setAgentInstancesAndOperators } from 'store/service/state/actions';
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

const Deployed = ({
  serviceId,
  multisig,
  terminateButton,
  isShowAgentInstanceVisible,
}) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => get(state, 'service.serviceState.agentInstancesAndOperators'));

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (serviceId) {
        const tempData = await getAgentInstanceAndOperator(serviceId);
        if (isMounted) {
          dispatch(setAgentInstancesAndOperators(tempData));
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [serviceId]);

  return (
    <div className="step-4-terminate">
      <Space direction="vertical" size={10}>
        {isShowAgentInstanceVisible && (
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered
            rowKey="id"
          />
        )}
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
  isShowAgentInstanceVisible: PropTypes.bool,
};

Deployed.defaultProps = {
  serviceId: null,
  isShowAgentInstanceVisible: false,
};

export default Deployed;
