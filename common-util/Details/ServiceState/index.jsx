import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Steps, Tooltip, Image,
} from 'antd';
import get from 'lodash/get';

import { useHelpers } from 'common-util/hooks';
import { getServiceTableDataSource, onTerminate, checkIfEth } from './utils';
import StepPreRegistration from './1StepPreRegistration';
import StepActiveRegistration from './2StepActiveRegistration';
import StepFinishedRegistration from './3rdStepFinishedRegistration';
import Deployed from './4thStepDeployed';
import Unbond from './5StepUnbond';
import { InfoSubHeader } from '../styles';
import { GenericLabel, ServiceStateContainer } from './styles';

const SERVICE_STATE_HELPER_LABELS = {
  'pre-registration': 'The service has just been minted.',
  'active-registration':
    'The service is waiting for agent operators to register their agent instances.',
  'finished-registration':
    'All agent instance slots have been filled. Waiting for the service owner to continue deploying the service.',
  deployed:
    'The service is in default operational state. Agent operators can turn on their agent instances at this point.',
  terminated:
    'The service has been terminated by the service owner. Waiting for the operators to unbond all registered agents.',
};

export const ServiceState = ({
  account,
  isOwner,
  id,
  details,
  updateDetails,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [dataSource, setDataSource] = useState([]);
  const [isEthToken, setIsEthToken] = useState(true); // by default, assume it's an eth token
  const [isStateImageVisible, setIsStateImageVisible] = useState(false);
  const { chainId, doesNetworkHaveValidServiceManagerToken } = useHelpers();

  const status = get(details, 'state');
  const agentIds = get(details, 'agentIds');
  const multisig = get(details, 'multisig') || '';
  const threshold = get(details, 'threshold') || '';
  const owner = get(details, 'owner') || '';
  const securityDeposit = get(details, 'securityDeposit');
  const canShowMultisigSameAddress = get(details, 'multisig') !== `0x${'0'.repeat(40)}`;

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (id && (agentIds || []).length !== 0) {
        const temp = await getServiceTableDataSource(id, agentIds || []);
        if (isMounted) {
          setDataSource(temp);
        }
      }

      // if valid service id, check if it's an eth token
      if (id && chainId && doesNetworkHaveValidServiceManagerToken) {
        const isEth = await checkIfEth(id);
        if (isMounted) {
          setIsEthToken(isEth);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [id, agentIds, chainId, doesNetworkHaveValidServiceManagerToken]);

  useEffect(() => {
    setCurrentStep(Number(status) - 1);
  }, [status]);

  /* ----- helper functions ----- */
  const getButton = (button, otherArgs) => {
    const { message, condition = isOwner, step } = otherArgs || {};

    // if not the current step, just return the button without showing tooltip
    if (step !== currentStep + 1) return button;

    if (condition) return button;

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

  /**
   *
   * @param {number} step step to compare with current active service state
   * @param {object} extra default values of each property
   * @returns other props for button
   */
  const getOtherBtnProps = (step, extra) => {
    const { isDisabled } = extra || {};
    return {
      disabled: currentStep + 1 !== step || !!isDisabled || !account,
    };
  };

  const commonProps = {
    serviceId: id,
    updateDetails,
    isOwner,
    getButton,
    getOtherBtnProps,
  };

  const steps = [
    {
      id: 'pre-registration',
      title: 'Pre-Registration',
      component: (
        <StepPreRegistration
          isEthToken={isEthToken}
          securityDeposit={securityDeposit}
          {...commonProps}
        />
      ),
    },
    {
      id: 'active-registration',
      title: 'Active Registration',
      component: (
        <StepActiveRegistration
          dataSource={dataSource}
          setDataSource={setDataSource}
          handleTerminate={handleTerminate}
          isEthToken={isEthToken}
          {...commonProps}
        />
      ),
    },
    {
      id: 'finished-registration',
      title: 'Finished Registration',
      component: (
        <StepFinishedRegistration
          multisig={multisig}
          threshold={threshold}
          owner={owner}
          handleTerminate={handleTerminate}
          // show multisig (2nd radio button option) if the service multisig !== 0
          canShowMultisigSameAddress={canShowMultisigSameAddress}
          {...commonProps}
        />
      ),
    },
    {
      id: 'deployed',
      title: 'Deployed',
      component: (
        <Deployed
          // If in pre-registration step, don't show the table
          isShowAgentInstanceVisible={currentStep !== 0}
          multisig={multisig}
          currentStep={currentStep}
          {...commonProps}
        />
      ),
    },
    {
      id: 'terminated',
      title: 'Terminated Bonded',
      component: <Unbond {...commonProps} />,
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

      <Steps
        direction="vertical"
        current={currentStep}
        items={steps.map(({ id: key, title, component }) => ({
          key,
          title: (
            <>
              {title}
              <GenericLabel>{SERVICE_STATE_HELPER_LABELS[key]}</GenericLabel>
            </>
          ),
          description: component,
        }))}
      />
    </ServiceStateContainer>
  );
};

ServiceState.propTypes = {
  account: PropTypes.string,
  id: PropTypes.string.isRequired,
  isOwner: PropTypes.bool,
  details: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  updateDetails: PropTypes.func,
};

ServiceState.defaultProps = {
  account: null,
  details: [],
  isOwner: false,
  updateDetails: () => {},
};
