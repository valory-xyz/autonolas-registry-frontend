import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Table, Space } from 'antd';
import { AddressLink } from '@autonolas/frontend-library';

import { setAgentInstancesAndOperators } from 'store/service/state/actions';
import { useScreen } from 'common-util/hooks/useScreen';
import { useHelpers } from 'common-util/hooks/useHelpers';
import { SendTransactionButton } from 'common-util/TransactionHelpers/SendTransactionButton';
import { useAgentInstanceAndOperator } from '../../useSvmService';
import { getAgentInstanceAndOperator, onTerminate } from '../utils';

export const Deployed = ({
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
  const {
    account, chainId, isSvm, chainName,
  } = useHelpers();
  const { isMobile } = useScreen();
  const data = useSelector(
    (state) => state?.service?.serviceState?.agentInstancesAndOperators,
  );
  const [isTerminating, setIsTerminating] = useState(false);
  const { getSvmAgentInstanceAndOperator } = useAgentInstanceAndOperator();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      // fetch agent instances and operators if service state is moved to step 4
      if (serviceId || currentStep === 3) {
        const tempData = isSvm
          ? await getSvmAgentInstanceAndOperator(serviceId)
          : await getAgentInstanceAndOperator(serviceId);
        if (isMounted) {
          dispatch(setAgentInstancesAndOperators(tempData));
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [
    serviceId,
    chainId,
    isSvm,
    currentStep,
    dispatch,
    getSvmAgentInstanceAndOperator,
  ]);

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

  const addressLinkProps = useMemo(
    () => ({
      chainId,
      chainName,
      suffixCount: isMobile ? 4 : 6,
    }),
    [chainName, isMobile, chainId],
  );

  return (
    <div className="step-4-terminate">
      <Space direction="vertical" size={10}>
        {isShowAgentInstanceVisible && (
          <Table
            dataSource={data}
            pagination={false}
            bordered
            rowKey="id"
            columns={[
              {
                title: 'Agent Instances',
                dataIndex: 'agentInstance',
                key: 'agentInstance',
                render: (text) => (
                  <AddressLink text={text} {...addressLinkProps} />
                ),
              },
              {
                title: 'Operators',
                dataIndex: 'operatorAddress',
                key: 'operatorAddress',
                render: (text) => (
                  <AddressLink text={text} {...addressLinkProps} />
                ),
              },
            ]}
          />
        )}
        <div>{`Safe contract address: ${multisig}`}</div>
        {getButton(
          <SendTransactionButton
            onClick={handleTerminate}
            loading={isTerminating}
            {...getOtherBtnProps(4, { isDisabled: !isOwner })}
          >
            Terminate
          </SendTransactionButton>,
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
