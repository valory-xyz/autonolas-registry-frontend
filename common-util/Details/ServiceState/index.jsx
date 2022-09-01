import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import {
  Button, Space, Divider, Steps, Tooltip,
} from 'antd/lib';
import get from 'lodash/get';
import kebabCase from 'lodash/kebabCase';
import { URL } from 'util/constants';
import {
  onActivateRegistration,
  getServiceTableDataSource,
  onTerminate,
  onStep2RegisterAgents,
  onStep3Deploy,
  onStep5Unbond,
} from './utils';
import ActiveRegistrationTable from './ActiveRegistrationTable';
import StepThreePayload from './StepThreePayload';
import StepFourDeploy from './StepFourDeploy';
import { InfoSubHeader } from '../styles';
import { ServiceStateContainer } from './styles';

const { Step } = Steps;

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
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [dataSource, setDataSource] = useState([]);

  const status = get(details, 'state');
  const agentIds = get(details, 'agentIds');
  const securityDeposit = get(details, 'securityDeposit');
  const [stepDeployRadioValue, setStepDeployRadioValue] = useState(null);

  useEffect(async () => {
    if (id && (agentIds || []).length !== 0) {
      const temp = await getServiceTableDataSource(id, agentIds || []);
      setDataSource(temp);
    }
  }, [id, agentIds]);

  useEffect(() => {
    setCurrentStep(Number(status) - 1);
  }, [status]);

  /* ----- helper functions ----- */
  const getButton = (button, message, isValid = isOwner) => {
    if (isValid) return button;

    return (
      <Tooltip
        title={message || 'Only the service owner can take this action'}
        placement="right"
        align="center"
      >
        {button}
      </Tooltip>
    );
  };

  /* ----- common functions ----- */
  const handleTerminate = async () => {
    try {
      await onTerminate(account, id);
      await updateDetails();
    } catch (e) {
      console.error(e);
    }
  };

  /* ----- step 1 ----- */
  const handleStep1Registration = async () => {
    try {
      await onActivateRegistration(account, id, securityDeposit);
      await updateDetails();
    } catch (e) {
      console.error(e);
    }
  };

  const handleStep1Update = () => {
    router.push(`${URL.UPDATE_SERVICE}/${id}`);
  };

  /* ----- step 2 ----- */
  const handleStep2RegisterAgents = async () => {
    const agentInstances = dataSource.map(
      ({ agentAddresses }) => agentAddresses,
    );

    try {
      await onStep2RegisterAgents({
        account,
        serviceId: id,
        agentIds,
        agentInstances,
      });
      await updateDetails();
    } catch (e) {
      console.error(e);
    }
  };

  /* ----- step 3 ----- */
  const handleStep3Deploy = async (radioValue, payload) => {
    try {
      await onStep3Deploy(account, id, radioValue, payload);
      await updateDetails();
    } catch (e) {
      console.error(e);
    }
  };

  /* ----- step 4 ----- */
  const handleStep4Terminate = async () => {
    try {
      await onTerminate(account, id);
      await updateDetails();
    } catch (e) {
      console.error(e);
    }
  };

  /* ----- step 5 ----- */
  const handleStep5Unbond = async () => {
    try {
      await onStep5Unbond(account, id);
      await updateDetails();
    } catch (e) {
      console.error(e);
    }
  };

  const steps = [
    {
      title: 'Pre-Registration',
      component: (
        <Space>
          <Button onClick={handleStep1Registration}>
            Activate Registration
          </Button>
          <Button onClick={handleStep1Update}>Update</Button>
        </Space>
      ),
    },
    {
      title: 'Active Registration',
      component: (
        <div className="step-2-active-registration">
          <ActiveRegistrationTable
            data={dataSource}
            setDataSource={setDataSource}
            bordered
          />

          <Button onClick={handleStep2RegisterAgents}>Register Agents</Button>
          <Divider />
          <Button onClick={handleTerminate}>Terminate</Button>
        </div>
      ),
    },
    {
      title: 'Finished Registration',
      component: (
        <StepThreePayload
          handleStep3Deploy={handleStep3Deploy}
          handleTerminate={handleTerminate}
        />
      ),
    },
    {
      title: 'Deployed',
      component: (
        <div className="step-4-terminate">
          <StepFourDeploy
            radioValue={stepDeployRadioValue}
            setRadioValue={setStepDeployRadioValue}
          />

          <Space direction="vertical" size={10}>
            <div>{`Safe contract address: ${get(details, 'multisig')}`}</div>
            {getButton(
              <Button
                disabled={!isOwner || !stepDeployRadioValue}
                onClick={handleStep4Terminate}
              >
                Terminate
              </Button>,
            )}
          </Space>
        </div>
      ),
    },
    {
      title: 'Terminated Bonded',
      component: getButton(
        <Button disabled={!isOwner} onClick={handleStep5Unbond}>
          Unbond
        </Button>,
      ),
    },
  ];

  return (
    <ServiceStateContainer>
      <InfoSubHeader>State</InfoSubHeader>
      <Steps direction="vertical" current={currentStep}>
        {steps.map(({ title, component }, index) => (
          <Step
            key={kebabCase(title)}
            title={title}
            description={currentStep === index ? component : <Empty />}
          />
        ))}
      </Steps>
    </ServiceStateContainer>
  );
};

ServiceState.propTypes = {
  account: PropTypes.string,
  id: PropTypes.string.isRequired,
  isOwner: PropTypes.bool,
  details: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  ),
  updateDetails: PropTypes.func,
};

ServiceState.defaultProps = {
  account: null,
  details: [],
  isOwner: false,
  updateDetails: () => {},
};
