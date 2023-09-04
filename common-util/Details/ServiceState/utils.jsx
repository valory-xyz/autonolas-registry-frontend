/* eslint-disable max-len */
import compact from 'lodash/compact';
import { ethers } from 'ethers';
import {
  ADDRESSES,
  getGenericErc20Contract,
  getOperatorWhitelistContract,
  getServiceContract,
  getServiceManagerContract,
  getServiceRegistryTokenUtilityContract,
} from 'common-util/Contracts';
import { triggerTransaction } from 'common-util/functions/triggerTransaction';
import { notifyError, notifySuccess } from 'common-util/functions';
import { DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS } from 'util/constants';

/* ----- helper functions ----- */

// params.agentParams.slots[i] = total initial available Slots for the i-th service.agentIds;

export const getNumberOfAgentAddress = (agentAddresses) => {
  /**
   * get the number of addresses
   * g1. ['0x123', '0x456'] => 2
   * eg2. ['0x123', '0x456', ''] => 2 // empty string (falsy) is ignored
   */
  const addressCount = compact((agentAddresses || '').split(',')).length;
  return addressCount;
};

/**
 *
 * @param {String} id serviceId
 * @param {Array} tableDataSource dataSource of the table and it can be null or undefined
 * @returns {Promise} { totalBonds, bondsArray, slotsArray }
 */
export const getBonds = async (id, tableDataSource) => {
  const serviceContract = await getServiceContract();
  const response = await serviceContract.getAgentParams(id);

  const bondsArray = [];
  const slotsArray = [];
  for (let i = 0; i < response.agentParams.length; i += 1) {
    /**
     * agentParams = [{ slots: 2, bond: 2000 }, { slots: 3, bond: 4000 }]
     * slotsArray = [2, 3]
     * bondsArray = [2000, 4000]
     */

    const { bond, slots } = response.agentParams[i];
    slotsArray.push(slots);
    bondsArray.push(bond);
  }

  /**
   * FOR AGENT ID
   * 1. get the bond value
   * 2. get the number of input addresses
   * 3. multiply the number of past addresses with the bond value
   *
   * @example
   * input: [agentId1 => 2 address, agentId2 => 3 address]
   * bonds: [100, 200]
   * output: 2 * 100 + 3 * 200 = 800
   */

  let totalBonds = 0;
  (tableDataSource || []).forEach((data) => {
    const { agentAddresses, bond } = data;

    /**
     * get the number of addresses
     * g1. ['0x123', '0x456'] => 2
     * eg2. ['0x123', '0x456', ''] => 2 // empty string (falsy) is ignored
     */
    const numberOfAgentAddress = getNumberOfAgentAddress(agentAddresses);

    // multiply the number of addresses with the bond value of the agentId
    totalBonds += numberOfAgentAddress * bond;
  });

  return { slots: slotsArray, bonds: bondsArray, totalBonds };
};

/* ----- common functions ----- */
export const onTerminate = async (account, id) => {
  const contract = await getServiceManagerContract();
  const txResponse = await contract.terminate(id, {
    from: account,
    gasLimit: 1000000,
  });
  const response = await triggerTransaction(txResponse, account);
  notifySuccess('Terminated Successfully');
  return response;
};

export const getServiceOwner = async (id) => {
  const contract = await getServiceContract();
  const response = await contract.ownerOf(id);
  return response;
};

export const getTokenDetailsRequest = async (serviceId) => {
  const contract = await getServiceRegistryTokenUtilityContract();
  const deposit = await contract.mapServiceIdTokenDeposit(serviceId);
  return deposit;
};

const hasSufficientTokenRequest = async ({ account, chainId, serviceId }) => {
  /**
   * - fetch the token address from the serviceId
   * - fetch the allowance of the token using the token address
   */
  const { token } = await getTokenDetailsRequest(serviceId);
  const contract = await getGenericErc20Contract(token);
  const response = contract.allowance(
    account,
    ADDRESSES[chainId].serviceRegistryTokenUtility,
  );
  return !(ethers.BigNumber.from(response) < ethers.constants.MaxUint256);
};

/**
 * Approves
 */
const approveToken = async ({ account, chainId, serviceId }) => {
  const { token } = await getTokenDetailsRequest(serviceId);
  const contract = await getGenericErc20Contract(token);
  const txResponse = await contract.approve(
    ADDRESSES[chainId].serviceRegistryTokenUtility,
    ethers.constants.MaxUint256,
  );

  const response = await triggerTransaction(txResponse, account);
  return response;
};

export const checkAndApproveToken = ({ account, chainId, serviceId }) => new Promise((resolve, reject) => {
  hasSufficientTokenRequest({
    account,
    chainId,
    serviceId,
  })
    .then((hasTokenBalance) => {
      if (!hasTokenBalance) {
        approveToken({
          account,
          chainId,
          serviceId,
        })
          .then((response) => {
            resolve(response);
          })
          .catch((e) => {
            reject(e);
          });
      } else {
        resolve();
      }
    })
    .catch((e) => {
      reject(e);
    });
});

/* ----- step 1 functions ----- */
export const checkIfEth = (id) => new Promise((resolve, reject) => {
  getTokenDetailsRequest(id)
    .then((response) => {
      resolve(response.token === DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS);
    })
    .catch((e) => {
      reject(e);
      notifyError('Error occured on checking token');
    });
});

// NOTE: this function is used only for testing
export const mintTokenRequest = async ({ account, serviceId }) => {
  const { token } = await getTokenDetailsRequest(serviceId);
  const contract = await getGenericErc20Contract(token);
  const txResponse = await contract.mint(
    account,
    ethers.utils.parseEther('1000'),
  );
  await triggerTransaction(txResponse, account);
  return null;
};

export const onActivateRegistration = async (account, id, deposit) => {
  const contract = await getServiceManagerContract();
  const txResponse = await contract.activateRegistration(id, {
    value: deposit,
  });
  const response = await triggerTransaction(txResponse, account);
  notifySuccess('Activated Successfully');
  return response;
};

/* ----- step 2 functions ----- */
export const getServiceTableDataSource = async (id, agentIds) => {
  const contract = await getServiceContract();
  const response = await getBonds(id);
  const { slots, bonds } = response;
  /**
   * for each agent Id, we call instances = getInstancesForAgentId(serviceId, agentId):
   * instances.numAgentInstances will give the number of occupied instances slots, so in
   * the Available Slots row you subtract params.agentParams.slots[i] -
   * instances.numAgentInstances, considering the same agentId. And as for Agent Addresses
   * for the correspondent Agent ID, just grab all the values from the:
   * instances.agentInstances
   */
  const numAgentInstancesArray = await Promise.all(
    agentIds.map(async (agentId) => {
      const info = await contract.getInstancesForAgentId(id, agentId);
      return info.numAgentInstances;
    }),
  );

  const dateSource = agentIds.map((aid, i) => ({
    key: aid,
    agentId: aid,
    availableSlots: Number(slots[i]) - Number(numAgentInstancesArray[i]),
    totalSlots: slots[i],
    bond: bonds[i],
    agentAddresses: null,
  }));

  return dateSource;
};

export const checkIfAgentInstancesAreValid = async ({
  account,
  agentInstances,
}) => {
  const contract = await getServiceContract();

  // check if the operator is registered as an agent instance already
  const operator = await contract.mapAgentInstanceOperators(account);
  if (operator !== DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS) {
    notifyError('The operator is registered as an agent instance already.');
    return false;
  }

  // check if the agent instances are valid
  const ifValidPromiseArray = agentInstances.map(async (agentInstance) => {
    const isValid = await contract.mapAgentInstanceOperators(agentInstance);
    return isValid;
  });

  const ifValidArray = (await Promise.all(ifValidPromiseArray)).some(
    (isValid) => isValid === DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS,
  );

  if (!ifValidArray) {
    notifyError('The agent instance address is already registered.');
    return false;
  }

  return true;
};

export const onStep2RegisterAgents = async ({
  account,
  serviceId,
  agentIds,
  agentInstances,
  dataSource,
}) => {
  const contract = await getServiceManagerContract();
  const { totalBonds } = await getBonds(serviceId, dataSource);

  const tx = await contract.registerAgents(
    serviceId,
    agentInstances,
    agentIds,
    {
      from: account,
      value: `${totalBonds}`,
    },
  );

  const response = await triggerTransaction(tx, account);
  notifySuccess('Registered Successfully');
  return response;
};

export const getTokenBondRequest = async (id, source) => {
  const contract = await getServiceRegistryTokenUtilityContract();
  return Promise.all(
    (source || []).map(async ({ agentId }) => {
      const bond = await contract.getAgentBond(id, agentId);
      return bond;
    }),
  );
};

export const getServiceAgentInstances = async (id) => {
  const contract = await getServiceContract();
  const response = await contract.getAgentInstances(id);
  return response?.agentInstances;
};

export const onStep3Deploy = async (
  account,
  id,
  radioValue,
  payload = '0x',
) => {
  const contract = await getServiceManagerContract();
  const tx = await contract.deploy(id, radioValue, payload);
  const response = triggerTransaction(tx, account);
  notifySuccess('Deployed Successfully');
  return response;
};

/* ----- step 4 functions ----- */
export const getAgentInstanceAndOperator = async (id) => {
  const contract = await getServiceContract();
  const response = await contract.getAgentInstances(id);
  const data = await Promise.all(
    (response?.agentInstances || []).map(async (key, index) => {
      const operatorAddress = await contract.mapAgentInstanceOperators(key);
      return {
        id: `agent-instance-row-${index + 1}`,
        operatorAddress,
        agentInstance: key,
      };
    }),
  );
  return data;
};

/* ----- step 5 functions ----- */
export const onStep5Unbond = async (account, id) => {
  const contract = await getServiceManagerContract();
  const tx = await contract.unbond(id);
  const response = await triggerTransaction(tx, account);
  notifySuccess('Unbonded Successfully');
  return response;
};

/* ----- operator whitelist functions ----- */
// convert above function to async/await
export const checkIfServiceRequiresWhiltelisting = async (serviceId) => {
  const contract = await getOperatorWhitelistContract();
  // if true: it is whitelisted by default
  // else we can whitelist using the input field
  const response = await contract.mapServiceIdOperatorsCheck(serviceId);
  return response;
};

export const checkIfServiceIsWhitelisted = async (
  serviceId,
  operatorAddress,
) => {
  const contract = await getOperatorWhitelistContract();
  const response = contract.isOperatorWhitelisted(serviceId, operatorAddress);
  return response;
};

export const setOperatorsStatusesRequest = async ({
  account,
  serviceId,
  operatorAddresses,
  operatorStatuses,
}) => {
  const contract = await getOperatorWhitelistContract();
  const fn = await contract.setOperatorsStatuses(
    serviceId,
    operatorAddresses,
    operatorStatuses,
    true,
  );
  const response = await triggerTransaction(fn, account);
  return response;
};

export const setOperatorsCheckRequest = async ({
  account,
  serviceId,
  isChecked,
}) => {
  const contract = await getOperatorWhitelistContract();
  const txResponse = contract['setOperatorsCheck(uint256,bool)'](
    serviceId,
    isChecked,
  );
  const response = await triggerTransaction(txResponse, account);
  return response;
};
