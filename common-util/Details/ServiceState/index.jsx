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
import get from 'lodash/get';
// import { NA } from 'util/constants';
import {
  onActivateRegistration,
  getStep2DataSource,
  onTerminate,
  onStep2RegisterAgents,
  onStep3Deploy,
  onStep5Unbond,
} from './utils';
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

const multisigAddresses = [
  // '0x1c2cD884127b080F940b7546c1e9aaf525b1FA55', // this is for mainnet
  '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0',
];

const Empty = () => <br />;

/**
 * ServiceState component
 */
export const ServiceState = ({
  account,
  isOwner,
  id,
  details,
  updateDetails,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [dataSource, setDataSource] = useState([]);
  const [radioValue, setRadioValue] = useState(null);

  const status = get(details, 'state');
  const agentIds = get(details, 'agentIds');
  const securityDeposit = get(details, 'securityDeposit');

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
      await onActivateRegistration(account, id, securityDeposit);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStep1Update = () => {
    console.log('Step - 1, Button 2');
  };

  /* ----- step 2 ----- */
  const handleStep2RegisterAgents = async () => {
    try {
      await onStep2RegisterAgents(account, id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStep2Terminate = async () => {
    try {
      await onTerminate(account, id);
    } catch (e) {
      console.error(e);
    }
  };

  /* ----- step 3 ----- */

  const handleStep3Deploy = async () => {
    try {
      await onStep3Deploy(account, id, radioValue);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStep3Terminate = () => {
    console.log('Step - 3, Button 2');
  };

  /* ----- step 4 ----- */
  const isTerminateDisabled = !isOwner;
  const handleStep4Terminate = async () => {
    try {
      await onTerminate(account, id);
      await updateDetails();
    } catch (e) {
      console.error(e);
    }
  };

  const terminateBtn = (
    <Button
      disabled={isTerminateDisabled}
      onClick={handleStep4Terminate}
    >
      Terminate
    </Button>
  );

  /* ----- step 5 ----- */
  const isUnboundDisabled = !isOwner;
  const unboundBtn = (
    <Button
      disabled={isUnboundDisabled}
      onClick={async () => {
        try {
          await onStep5Unbond(account, id);
          await updateDetails();
        } catch (e) {
          console.error(e);
        }
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

                  <Radio.Group
                    value={radioValue}
                    onChange={(e) => setRadioValue(e.target.value)}
                  >
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
  account: PropTypes.string,
  id: PropTypes.string.isRequired,
  isOwner: PropTypes.bool,
  details: PropTypes.shape([]),
  updateDetails: PropTypes.func,
};

ServiceState.defaultProps = {
  account: null,
  details: {},
  isOwner: false,
  updateDetails: () => {},
};
