/* eslint-disable max-len */
import { compact } from 'lodash';
import { ethers } from 'ethers';
import {
  ADDRESSES,
  getGenericErc20Contract,
  getOperatorWhitelistContract,
  getServiceContract,
  getServiceManagerContract,
  getServiceRegistryTokenUtilityContract,
} from 'common-util/Contracts';
import { sendTransaction } from 'common-util/functions/sendTransaction';
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
export const getBonds = (id, tableDataSource) => new Promise((resolve, reject) => {
  const serviceContract = getServiceContract();
  serviceContract
    .getAgentParams(id)
    .then((response) => {
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

      resolve({ slots: slotsArray, bonds: bondsArray, totalBonds });
    })
    .catch((e) => {
      reject(e);
    });
});

/* ----- common functions ----- */
export const onTerminate = (account, id) => new Promise((resolve, reject) => {
  const contract = getServiceManagerContract();

  const fn = contract.terminate(id).send({ from: account });

  sendTransaction(fn, account)
    .then((information) => {
      resolve(information);
      notifySuccess('Terminated Successfully');
    })
    .catch((e) => {
      reject(e);
      notifyError();
    });
});

export const getServiceOwner = (id) => new Promise((resolve, reject) => {
  const contract = getServiceContract();

  contract
    .ownerOf(id)
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      reject(e);
    });
});

export const getTokenDetailsRequest = (serviceId) => new Promise((resolve, reject) => {
  const contract = getServiceRegistryTokenUtilityContract();

  contract
    .mapServiceIdTokenDeposit(serviceId)
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      reject(e);
      notifyError('Error occured on getting token details');
    });
});

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
const approveToken = ({ account, chainId, serviceId }) => new Promise((resolve, reject) => {
  getTokenDetailsRequest(serviceId)
    .then(({ token }) => {
      const contract = getGenericErc20Contract(token);
      const fn = contract
        .approve(
          ADDRESSES[chainId].serviceRegistryTokenUtility,
          ethers.constants.MaxUint256,
        )
        .send({ from: account });

      sendTransaction(fn, account)
        .then((response) => {
          resolve(response);
        })
        .catch((e) => {
          window.console.log('Error occured on approving');
          reject(e);
        });
    })
    .catch((e) => {
      reject(e);
      notifyError('Error occured on approving token');
    });
});

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
      const fn = contract
        .mint(account, ethers.utils.parseEther('1000'))
        .send({ from: account });

      sendTransaction(fn, account)
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

export const onActivateRegistration = (account, id, deposit) => new Promise((resolve, reject) => {
  const contract = getServiceManagerContract();

  const fn = contract
    .activateRegistration(id)
    .send({ from: account, value: deposit });

  sendTransaction(fn, account)
    .then((response) => {
      notifySuccess('Activated Successfully');
      resolve(response);
    })
    .catch((e) => {
      reject(e);
      notifyError('Error occured on activating registration');
    });
});

/* ----- step 2 functions ----- */
export const getServiceTableDataSource = async (id, agentIds) => new Promise((resolve, reject) => {
  const contract = getServiceContract();

  getBonds(id)
    .then(async ({ slots, bonds }) => {
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

      resolve(dateSource);
    })
    .catch((e) => {
      reject(e);
    });
});

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

      sendTransaction(fn, account)
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

/* ----- step 3 functions ----- */
export const getServiceAgentInstances = (id) => new Promise((resolve, reject) => {
  const contract = getServiceContract();

  contract
    .getAgentInstances(id)
    .then((response) => {
      resolve(response?.agentInstances);
    })
    .catch((e) => {
      reject(e);
    });
});

export const onStep3Deploy = (account, id, radioValue, payload = '0x') => new Promise((resolve, reject) => {
  const contract = getServiceManagerContract();
  const fn = contract.deploy(id, radioValue, payload).send({ from: account });

  sendTransaction(fn, account)
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
export const getAgentInstanceAndOperator = (id) => new Promise((resolve, reject) => {
  const contract = getServiceContract();

  contract
    .getAgentInstances(id)
    .then(async (response) => {
      const data = await Promise.all(
        (response?.agentInstances || []).map(async (key, index) => {
          const operatorAddress = await contract.mapAgentInstanceOperators(
            key,
          );
          return {
            id: `agent-instance-row-${index + 1}`,
            operatorAddress,
            agentInstance: key,
          };
        }),
      );
      resolve(data);
    })
    .catch((e) => {
      reject(e);
    });
});

/* ----- step 5 functions ----- */
export const onStep5Unbond = (account, id) => new Promise((resolve, reject) => {
  const contract = getServiceManagerContract();

  const fn = contract.unbond(id).send({ from: account });
  sendTransaction(fn, account)
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
export const checkIfServiceRequiresWhiltelisting = (serviceId) => new Promise((resolve, reject) => {
  const contract = getOperatorWhitelistContract();

  contract
    .mapServiceIdOperatorsCheck(serviceId)
    .then((response) => {
      // if true: it is whitelisted by default
      // else we can whitelist using the input field
      resolve(response);
    })
    .catch((e) => {
      reject(e);
      notifyError(
        'Error occured on checking if service requires whitelisting',
      );
    });
});

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

  sendTransaction(fn, account)
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      reject(e);
      notifyError('Error occured on checking operator whitelist');
    });
});

export const setOperatorsCheckRequest = ({ account, serviceId, isChecked }) => new Promise((resolve, reject) => {
  const contract = getOperatorWhitelistContract();

  const fn = contract
    .setOperatorsCheck(serviceId, isChecked)
    .send({ from: account });

  sendTransaction(fn, account)
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      reject(e);
      notifyError('Error occured on checking operator whitelist');
    });
});
