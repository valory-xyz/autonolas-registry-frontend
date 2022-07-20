import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Space,
  Divider,
  Radio,
  Typography,
  Steps,
  Tooltip,
} from 'antd/lib';
// import { NA } from 'util/constants';
import { onActivateRegistration, getStep2DataSource } from './utils';
import ActiveRegistrationTable from './ActiveRegistrationTable';
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
    title: 'Agent Instance Addresses',
    dataIndex: 'agentAddresses',
    key: 'agentAddresses',
    width: '40%',
    editable: true,
  },
];

const Empty = () => <br />;

/**
 * ServiceState component
 */
export const ServiceState = ({
  isOwner, id, status, agentIds = [],
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [dataSource, setDataSource] = useState([]);

  useEffect(async () => {
    if (id && (agentIds || []).length !== 0) {
      const temp = await getStep2DataSource(id, agentIds || []);
      setDataSource(temp);
    }
  }, [id, agentIds]);

  useEffect(() => {
    // setCurrentStep(1);
    setCurrentStep(Number(status) - 1);
  }, [status]);

  /* ----- step 1 ----- */
  const handleStep1Registration = async () => {
    try {
      await onActivateRegistration(id, agentIds);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStep1Update = () => {
    console.log('Step - 1, Button 2');
  };

  /* ----- step 2 ----- */
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
  const isTerminateDisabled = !isOwner;
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
  const isUnboundDisabled = !isOwner;
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
          description={
            currentStep === 0 ? (
              <Space>
                <Button onClick={handleStep1Registration}>
                  Activate Registration
                </Button>
                <Button onClick={handleStep1Update}>Update</Button>
              </Space>
            ) : (
              <Empty />
            )
          }
        />

        <Step
          title="Active Registration"
          description={
            currentStep === 1 ? (
              <div className="step-2-active-registration">
                <ActiveRegistrationTable
                  data={dataSource}
                  defaultColumns={STEP_2_TABLE_COLUMNS}
                  setDataSource={setDataSource}
                  bordered
                />

                <Button onClick={handleStep2RegisterAgents}>
                  Register Agents
                </Button>
                <Divider />
                <Button onClick={handleStep2Terminate}>Terminate</Button>
              </div>
            ) : (
              <Empty />
            )
          }
        />

        <Step
          title="Finished Registration"
          description={
            currentStep === 2 ? (
              <div className="step-3-finished-registration">
                <Space direction="vertical" size={10}>
                  <Typography.Text>
                    Choose multi-sig implementation:
                  </Typography.Text>

                  <Radio.Group>
                    <Space direction="vertical" size={10}>
                      {multisigAddresses.map((multisigAddress) => (
                        <Radio key={multisigAddress} value={multisigAddress}>
                          {multisigAddress}
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>

                  <Button onClick={handleStep3Deploy}>Deploy</Button>
                  <Divider className="m-0" />
                  <Button onClick={handleStep3Terminate}>Terminate</Button>
                </Space>
              </div>
            ) : (
              <Empty />
            )
          }
        />

        <Step
          title="Deployed"
          description={
            currentStep === 3 ? (
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
            ) : (
              <Empty />
            )
          }
        />

        <Step
          title="Terminated Bonded"
          description={
            currentStep === 4 ? (
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
            ) : (
              <Empty />
            )
          }
        />
      </Steps>
    </ServiceStateContainer>
  );
};

ServiceState.propTypes = {
  status: PropTypes.string,
  agentIds: PropTypes.shape([]),
  id: PropTypes.string.isRequired,
  isOwner: PropTypes.bool,
};

ServiceState.defaultProps = {
  status: null,
  agentIds: [],
  isOwner: false,
};
