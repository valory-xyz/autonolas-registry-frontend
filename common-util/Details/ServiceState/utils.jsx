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
  const txResponse = await contract.terminate(id);
  // console.log('txResponse', txResponse);
  const response = await triggerTransaction(txResponse, account);
  // console.log('Final response', response);
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

const hasSufficientTokenRequest = ({ account, chainId, serviceId }) => new Promise((resolve, reject) => {
  /**
     * - fetch the token address from the serviceId
     * - fetch the allowance of the token using the token address
     */
  getTokenDetailsRequest(serviceId)
    .then(({ token }) => {
      const contract = getGenericErc20Contract(token);

      contract
        .allowance(account, ADDRESSES[chainId].serviceRegistryTokenUtility)
        .then((response) => {
          resolve(
            !(ethers.BigNumber.from(response) < ethers.constants.MaxUint256),
          );
        })
        .catch((e) => {
          reject(e);
          notifyError('Error occured on checking allowance');
        });
    })
    .catch((e) => {
      reject(e);
      notifyError('Error occured on checking token');
    });
});

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
export const mintTokenRequest = ({ account, serviceId }) => new Promise((resolve, reject) => {
  getTokenDetailsRequest(serviceId)
    .then(({ token }) => {
      const contract = getGenericErc20Contract(token);
      const txResponse = contract.mint(
        account,
        ethers.utils.parseEther('1000'),
      );
        // TODO: fix me
      triggerTransaction(txResponse, account)
        .then(() => resolve())
        .catch((e) => {
          reject(e);
          notifyError();
        });
    })
    .catch((e) => {
      reject(e);
    });
});

export const onActivateRegistration = async (account, id, deposit) => {
  const contract = await getServiceManagerContract();
  const code1 = await contract.provider.getCode(contract.address);
  const code2 = await contract.signer.provider.getCode(contract.address);
  console.log({
    contract,
    code1,
    code2,
    cc: code1 === code2,
  });
  const txResponse = await contract.activateRegistration(id, {
    value: deposit,
  });
  // const sendTransactionInfo = contract.signer.sendTransaction({
  //   to: contract.address,
  //   from: account,
  //   value: deposit,
  //   // gasLimit: 50000,
  //   gasLimit: 5000000,
  // });

  const response = await triggerTransaction(txResponse, account);
  notifySuccess('Activated Successfully');

  return response;

  // console.log({ provider });

  // const provider = contract.signer.signTransaction({
  //   from: account,
  //   value: deposit,
  //   to: contract.address,
  //   gasLimit: 200000,
  // }).then((e) => {
  //   console.log(e);
  // });

  // contract.signer
  //   .triggerTransaction({
  //     from: account,
  //     value: deposit,
  //     // to: contract.address,
  //     // gasLimit: 200000,
  //   })
  //   .then(async (e) => {
  //     console.log(e);

  //     const txResponse = await contract.activateRegistration(id);
  //     const response = await triggerTransaction(txResponse, account);

  //     console.log({ txResponse, response });

  //     notifySuccess('Activated Successfully');
  //     resolve(response);
  //   })
  //   .catch((e) => {
  //     reject(e);
  //     notifyError('Error occured on activating registration');
  //   });
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
  const contract = getServiceContract();

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

export const onStep2RegisterAgents = ({
  account,
  serviceId,
  agentIds,
  agentInstances,
  dataSource,
}) => new Promise((resolve, reject) => {
  const contract = getServiceManagerContract();

  getBonds(serviceId, dataSource)
    .then(({ totalBonds }) => {
      const fn = contract
        .registerAgents(serviceId, agentInstances, agentIds)
        .send({ from: account, value: `${totalBonds}` });

      // TODO: fix me
      triggerTransaction(fn, account)
        .then((information) => {
          resolve(information);
          notifySuccess('Registered Successfully');
        })
        .catch((e) => {
          reject(e);
        });
    })
    .catch((e) => {
      reject(e);
      notifyError();
    });
});

export const getTokenBondRequest = (id, source) => {
  const contract = getServiceRegistryTokenUtilityContract();

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

export const onStep3Deploy = (account, id, radioValue, payload = '0x') => new Promise((resolve, reject) => {
  const contract = getServiceManagerContract();
  const fn = contract.deploy(id, radioValue, payload).send({ from: account });

  // TODO: fix me
  triggerTransaction(fn, account)
    .then((information) => {
      resolve(information);
      notifySuccess('Deployed Successfully');
    })
    .catch((e) => {
      reject(e);
      notifyError();
    });
});

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
export const onStep5Unbond = (account, id) => new Promise((resolve, reject) => {
  const contract = getServiceManagerContract();

  const fn = contract.unbond(id).send({ from: account });

  // TODO: fix me
  triggerTransaction(fn, account)
    .then((information) => {
      resolve(information);
      notifySuccess('Unbonded Successfully');
    })
    .catch((e) => {
      notifyError();
      reject(e);
    });
});

/* ----- operator whitelist functions ----- */
// convert above function to async/await
export const checkIfServiceRequiresWhiltelisting = async (serviceId) => {
  const contract = await getOperatorWhitelistContract();
  // if true: it is whitelisted by default
  // else we can whitelist using the input field
  const response = await contract.mapServiceIdOperatorsCheck(serviceId);
  return response;
};

export const checkIfServiceIsWhitelisted = (serviceId, operatorAddress) => new Promise((resolve, reject) => {
  const contract = getOperatorWhitelistContract();

  contract
    .isOperatorWhitelisted(serviceId, operatorAddress)
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      reject(e);
      notifyError('Error occured on checking operator whitelist');
    });
});

export const setOperatorsStatusesRequest = ({
  account,
  serviceId,
  operatorAddresses,
  operatorStatuses,
}) => new Promise((resolve, reject) => {
  const contract = getOperatorWhitelistContract();

  const fn = contract
    .setOperatorsStatuses(
      serviceId,
      operatorAddresses,
      operatorStatuses,
      true,
    )
    .send({ from: account });

  // TODO: fix me
  triggerTransaction(fn, account)
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      reject(e);
      notifyError('Error occured on checking operator whitelist');
    });
});

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
