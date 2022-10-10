import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import {
  Button, Space, Steps, Tooltip, Image,
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
import StepActiveRegistration from './2StepActiveRegistration';
import StepFinishedRegistration from './3rdStepFinishedRegistration';
import Deployed from './4thStepDeployed';
import { InfoSubHeader } from '../styles';
import { ServiceStateContainer } from './styles';

const { Step } = Steps;

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
  const [isStateImageVisible, setIsStateImageVisible] = useState(false);

  const status = get(details, 'state');
  const agentIds = get(details, 'agentIds');
  const multisig = get(details, 'multisig') || '';
  const threshold = get(details, 'threshold') || '';
  const owner = get(details, 'owner') || '';
  const securityDeposit = get(details, 'securityDeposit');

  useEffect(() => {
    (async () => {
      if (id && (agentIds || []).length !== 0) {
        const temp = await getServiceTableDataSource(id, agentIds || []);
        setDataSource(temp);
      }
    })();
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
    const ids = [];
    const instances = dataSource.map(
      ({ agentAddresses, agentId, availableSlots }) => {
        /**
         * constructs agentIds:
         * If there are 2 slots then agentInstances would need 2 addresses of instances
         * ie. ids = [1, 1]
         */
        for (let i = 0; i < availableSlots; i += 1) {
          ids.push(agentId);
        }

        return (agentAddresses || '').trim();
      },
    );
    const agentInstances = (instances || [])
      .join()
      .split(',')
      .map((e) => e.trim());

    try {
      await onStep2RegisterAgents({
        account,
        serviceId: id,
        agentIds: ids,
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
        <StepActiveRegistration
          serviceId={id}
          dataSource={dataSource}
          setDataSource={setDataSource}
          handleStep2RegisterAgents={handleStep2RegisterAgents}
          handleTerminate={handleTerminate}
        />
      ),
    },
    {
      title: 'Finished Registration',
      component: (
        <StepFinishedRegistration
          serviceId={id}
          multisig={multisig}
          threshold={threshold}
          owner={owner}
          handleStep3Deploy={handleStep3Deploy}
          handleTerminate={handleTerminate}
          // show multisig (2nd radio button option) if the service multisig !== 0
          canShowMultisigSameAddress={
            get(details, 'multisig') !== `0x${'0'.repeat(40)}`
          }
        />
      ),
    },
    {
      title: 'Deployed',
      component: (
        <Deployed
          serviceId={id}
          multisig={multisig}
          terminateButton={getButton(
            <Button disabled={!isOwner} onClick={handleStep4Terminate}>
              Terminate
            </Button>,
          )}
        />
      ),
    },
    {
      title: 'Terminated Bonded',
      // TODO: button to be disabled if not operator (needs more details)
      component: <Button onClick={handleStep5Unbond}>Unbond</Button>,
    },
  ];

  return (
    <ServiceStateContainer>
      <InfoSubHeader>
        State
        <Button
          type="link"
          size="large"
          onClick={() => setIsStateImageVisible(true)}
        >
          Learn about service states
        </Button>
      </InfoSubHeader>

      {isStateImageVisible && (
        <Image
          width={200}
          src="/images/service-lifecycle.png"
          preview={{
            visible: isStateImageVisible,
            src: '/images/service-lifecycle.png',
            onVisibleChange: (value) => {
              setIsStateImageVisible(value);
            },
          }}
        />
      )}

      <Steps direction="vertical" current={currentStep}>
        {steps.map(({ title, component }) => (
          <Step key={kebabCase(title)} title={title} description={component} />
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
