import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Steps, Tooltip, Image,
} from 'antd';
import get from 'lodash/get';

import { useHelpers } from 'common-util/hooks';
import { getServiceTableDataSource, onTerminate, checkIfEth } from './utils';
import { PreRegistration } from './1StepPreRegistration';
import { ActiveRegistration } from './2StepActiveRegistration';
import { FinishedRegistration } from './3rdStepFinishedRegistration';
import { Deployed } from './4thStepDeployed';
import { Unbond } from './5StepUnbond';
import { useSvmServiceTableDataSource } from '../useSvmService';
import { InfoSubHeader, GenericLabel, ServiceStateContainer } from './styles';

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

const ServiceStateHeader = () => {
  const [isStateImageVisible, setIsStateImageVisible] = useState(false);
  const onLearnAbout = () => setIsStateImageVisible(true);
  return (
    <>
      <InfoSubHeader>
        State
        <Button type="link" size="large" onClick={onLearnAbout}>
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
    </>
  );
};

export const ServiceState = ({
  isOwner, id, details, updateDetails,
}) => {
  const {
    account, chainId, isSvm, doesNetworkHaveValidServiceManagerToken,
  } = useHelpers();
  const [currentStep, setCurrentStep] = useState(1);
  const [dataSource, setDataSource] = useState([]);

  // by default, assume it's an eth token
  // if svm, then it's not an eth token
  const [isEthToken, setIsEthToken] = useState(!isSvm);
  useEffect(() => {
    if (isSvm) setIsEthToken(false);
  }, [isSvm]);

  // hooks for SVM
  const { getSvmServiceTableDataSource } = useSvmServiceTableDataSource();

  const status = get(details, 'state');
  const agentIds = get(details, 'agentIds');
  const multisig = get(details, 'multisig') || '';
  const threshold = get(details, 'threshold') || '';
  const owner = get(details, 'owner') || '';
  const securityDeposit = get(details, 'securityDeposit');
  const canShowMultisigSameAddress = get(details, 'multisig') !== `0x${'0'.repeat(40)}`;

  // get service table data source and check if it's an eth token
  useEffect(() => {
    let isMounted = true;
    const getData = async () => {
      if (id && (agentIds || []).length !== 0) {
        const temp = isSvm
          ? await getSvmServiceTableDataSource(id, agentIds || [])
          : await getServiceTableDataSource(id, agentIds || []);
        if (isMounted) {
          setDataSource(temp);
        }
      }
      // if valid service id, check if it's an eth token
      // and SVM is not eth token
      if (id && chainId && doesNetworkHaveValidServiceManagerToken && !isSvm) {
        const isEth = await checkIfEth(id);
        if (isMounted) {
          setIsEthToken(isEth);
        }
      }
    };

    getData();

    return () => {
      isMounted = false;
    };
  }, [
    id,
    agentIds,
    isSvm,
    chainId,
    doesNetworkHaveValidServiceManagerToken,
    getSvmServiceTableDataSource,
  ]);

  useEffect(() => {
    setCurrentStep(Number(status) - 1);
  }, [status]);

  /* ----- helper functions ----- */
  const getButton = (button, otherArgs) => {
    const { message, condition = isOwner, step } = otherArgs || {};

    // if not the current step, just return the button without showing tooltip
    if (step !== currentStep + 1) return button;

    // if the condition is true, return the button without showing tooltip
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
  const handleTerminate = useCallback(async () => {
    try {
      await onTerminate(account, id);
      await updateDetails();
    } catch (e) {
      console.error(e);
    }
  }, [account, id, updateDetails]);

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
    isOwner,
    updateDetails,
    getButton,
    getOtherBtnProps,
  };

  const steps = [
    {
      id: 'pre-registration',
      title: 'Pre-Registration',
      component: (
        <PreRegistration
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
        <ActiveRegistration
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
        <FinishedRegistration
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
      <ServiceStateHeader />
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
  id: PropTypes.string.isRequired,
  isOwner: PropTypes.bool,
  details: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  updateDetails: PropTypes.func,
};

ServiceState.defaultProps = {
  details: [],
  isOwner: false,
  updateDetails: () => {},
};
