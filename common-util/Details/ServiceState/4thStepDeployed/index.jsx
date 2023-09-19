import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Table, Space, Button } from 'antd';
import { AddressLink } from '@autonolas/frontend-library';

import { setAgentInstancesAndOperators } from 'store/service/state/actions';
import { useScreen } from 'common-util/hooks/useScreen';
import { useHelpers } from 'common-util/hooks/useHelpers';
import { getAgentInstanceAndOperator, onTerminate } from '../utils';

const Deployed = ({
  serviceId,
  multisig,
  isShowAgentInstanceVisible,
  currentStep,
  isOwner,
  getButton,
  getOtherBtnProps,
  updateDetails,
}) => {
  const dispatch = useDispatch();
  const data = useSelector(
    (state) => state?.service?.serviceState?.agentInstancesAndOperators,
  );
  const { account } = useHelpers();
  const [isTerminating, setIsTerminating] = useState(false);
  const { isMobile } = useScreen();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      // fetch agent instances and operators if service state is moved to step 4
      if (serviceId || currentStep === 3) {
        const tempData = await getAgentInstanceAndOperator(serviceId);
        if (isMounted) {
          dispatch(setAgentInstancesAndOperators(tempData));
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [serviceId, currentStep]);

  const handleTerminate = async () => {
    try {
      setIsTerminating(true);
      await onTerminate(account, serviceId);
      await updateDetails();
    } catch (e) {
      console.error(e);
    } finally {
      setIsTerminating(false);
    }
  };

  return (
    <div className="step-4-terminate">
      <Space direction="vertical" size={10}>
        {isShowAgentInstanceVisible && (
          <Table
            columns={[
              {
                title: 'Agent Instances',
                dataIndex: 'agentInstance',
                key: 'agentInstance',
                render: (text) => (
                  <AddressLink text={text} suffixCount={isMobile ? 4 : 6} />
                ),
              },
              {
                title: 'Operators',
                dataIndex: 'operatorAddress',
                key: 'operatorAddress',
                render: (text) => (
                  <AddressLink text={text} suffixCount={isMobile ? 4 : 6} />
                ),
              },
            ]}
            dataSource={data}
            pagination={false}
            bordered
            rowKey="id"
          />
        )}
        <div>{`Safe contract address: ${multisig}`}</div>
        {getButton(
          <Button
            onClick={handleTerminate}
            loading={isTerminating}
            {...getOtherBtnProps(4, { isDisabled: !isOwner })}
          >
            Terminate
          </Button>,
          { step: 4 },
        )}
      </Space>
    </div>
  );
};

Deployed.propTypes = {
  serviceId: PropTypes.string,
  multisig: PropTypes.string.isRequired,
  isShowAgentInstanceVisible: PropTypes.bool,
  currentStep: PropTypes.number.isRequired,
  getButton: PropTypes.func.isRequired,
  getOtherBtnProps: PropTypes.func.isRequired,
  updateDetails: PropTypes.func.isRequired,
  isOwner: PropTypes.bool,
};

Deployed.defaultProps = {
  serviceId: null,
  isShowAgentInstanceVisible: false,
  isOwner: false,
};

export default Deployed;
