import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Space,
  Divider,
  Table,
  Radio,
  Typography,
  Steps,
  Tooltip,
} from 'antd';
import { NA } from 'util/constants';
import { ServiceStateContainer, InfoSubHeader } from '../styles';

const { Step } = Steps;

const STEP_2_TABLE_COLUMNS = [
  {
    title: 'Agent ID',
    dataIndex: 'agentId',
    key: 'agentId',
  },
  {
    title: 'Available Slots',
    dataIndex: 'availableSlots',
    key: 'availableSlots',
  },
  {
    title: 'Total Slots',
    dataIndex: 'totalSlots',
    key: 'totalSlots',
  },
  {
    title: 'Agent Addresses',
    dataIndex: 'agentAddresses',
    key: 'agentAddresses',
  },
];

/**
 * ServiceState component
 */
export const ServiceState = ({ isOwner, status }) => {
  const [currentStep, setCurrentStep] = useState(1);
  console.log({ status });

  useEffect(() => {
    setCurrentStep(Number(status));
  }, [status]);

  /* ----- step 1 ----- */
  const handleStep1Registration = () => {
    console.log('Step - 1, Button 1');
  };

  const handleStep1Update = () => {
    console.log('Step - 1, Button 2');
  };

  /* ----- step 2 ----- */
  const dataSource = [
    {
      key: '1',
      agentId: '1',
      availableSlots: 3,
      totalSlots: 10,
      agentAddresses: NA,
    },
    {
      key: '2',
      agentId: '4',
      availableSlots: 0,
      totalSlots: 10,
      agentAddresses: NA,
    },
  ];

  const handleStep2RegisterAgents = () => {
    console.log('Step - 2, Button 1');
  };

  const handleStep2Terminate = () => {
    console.log('Step - 2, Button 2');
  };

  /* ----- step 3 ----- */
  const multisigAddresses = [
    '0x7651239879182341321',
    '0x7651239879182341322',
    '0x7651239879182341323',
  ];

  const handleStep3Deploy = () => {
    console.log('Step - 3, Button 1');
  };

  const handleStep3Terminate = () => {
    console.log('Step - 3, Button 2');
  };

  /* ----- step 4 ----- */
  const isTerminateDisabled = true;
  const terminateBtn = (
    <Button
      disabled={isTerminateDisabled}
      onClick={() => {
        console.log('Step - 4, Button 1');
      }}
    >
      Terminate
    </Button>
  );

  /* ----- step 5 ----- */
  const isUnboundDisabled = true;
  const unboundBtn = (
    <Button
      disabled={isUnboundDisabled}
      onClick={() => {
        console.log('Step - 5, Button 1');
      }}
    >
      Unbond
    </Button>
  );

  return (
    <ServiceStateContainer>
      <Divider />
      <InfoSubHeader>State</InfoSubHeader>
      <Steps direction="vertical" current={currentStep}>
        <Step
          title="Pre-Registration"
          description={(
            <Space>
              <Button onClick={handleStep1Registration}>
                Activate Registration
              </Button>
              <Button onClick={handleStep1Update}>Update</Button>
            </Space>
          )}
        />

        <Step
          title="Active Registration"
          description={(
            <div className="step-2-active-registration">
              <Table
                dataSource={dataSource}
                columns={STEP_2_TABLE_COLUMNS}
                pagination={false}
                bordered
              />
              <Button onClick={handleStep2RegisterAgents}>
                Register Agents
              </Button>
              <Divider />
              <Button onClick={handleStep2Terminate}>Terminate</Button>
            </div>
          )}
        />

        <Step
          title="Finished Registration"
          description={(
            <div className="step-3-finished-registration">
              <Space direction="vertical" size={1}>
                <Typography.Text>
                  Choose multi-sig implementation:
                </Typography.Text>
                <Radio.Group>
                  <Space direction="vertical">
                    {multisigAddresses.map((multisigAddress) => (
                      <Radio value={multisigAddress}>{multisigAddress}</Radio>
                    ))}
                  </Space>
                </Radio.Group>
                <Button onClick={handleStep3Deploy}>Deploy</Button>
                <Divider className="custom-divider" />
                <Button onClick={handleStep3Terminate}>Terminate</Button>
              </Space>
            </div>
          )}
        />

        <Step
          title="Deployed"
          description={(
            <>
              {isOwner ? (
                terminateBtn
              ) : (
                <Tooltip
                  title="Only the service owner can take this action"
                  placement="right"
                  align="center"
                >
                  {terminateBtn}
                </Tooltip>
              )}
            </>
          )}
        />

        <Step
          title="Terminated Bonded"
          description={(
            <>
              {isOwner ? (
                unboundBtn
              ) : (
                <Tooltip
                  title="Only agent operators with active bonds can take this action"
                  placement="right"
                  align="center"
                >
                  {unboundBtn}
                </Tooltip>
              )}
            </>
          )}
        />
      </Steps>
    </ServiceStateContainer>
  );
};

ServiceState.propTypes = {
  status: PropTypes.string,
  isOwner: PropTypes.bool,
};

ServiceState.defaultProps = {
  status: null,
  isOwner: false,
};
