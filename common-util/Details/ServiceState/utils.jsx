/* eslint-disable max-len */
import { notification } from 'antd/lib';
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
import { DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS } from 'util/constants';

const notifySuccess = (message = 'Terminated Successfully') => notification.success({ message });
const notifyError = (message = 'Some error occured') => notification.error({ message });

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
  serviceContract.methods
    .getAgentParams(id)
    .call()
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

      // totalBonds[0] = total bond in eth
      // totalBonds[1] = total bond in non-eth
      const totalBonds = [0, 0];
      (tableDataSource || []).forEach((data) => {
        const { agentAddresses, bond } = data;

        /**
           * get the number of addresses
           * g1. ['0x123', '0x456'] => 2
           * eg2. ['0x123', '0x456', ''] => 2 // empty string (falsy) is ignored
           */
        const numberOfAgentAddress = getNumberOfAgentAddress(agentAddresses);

        // multiply the number of addresses with the bond value of the agentId
        totalBonds[0] += numberOfAgentAddress * bond;
        totalBonds[1] += numberOfAgentAddress;
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

  contract.methods
    .terminate(id)
    .send({ from: account })
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

  contract.methods
    .ownerOf(id)
    .call()
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      reject(e);
    });
});

export const getTokenDetailsRequest = (id) => new Promise((resolve, reject) => {
  const contract = getServiceRegistryTokenUtilityContract();

  contract.methods
    .mapServiceIdTokenDeposit(id)
    .call()
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      reject(e);
      notifyError('Error occured on getting token details');
    });
});

export const hasSufficientTokenRequest = ({ account, chainId, serviceId }) => new Promise((resolve, reject) => {
  /**
     * - fetch the token address from the serviceId
     * - fetch the allowance of the token using the token address
     */
  getTokenDetailsRequest(serviceId)
    .then(({ token }) => {
      const contract = getGenericErc20Contract(token);

      contract.methods
        .allowance(account, ADDRESSES[chainId].serviceRegistryTokenUtility)
        .call()
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
export const approveToken = ({ account, chainId, serviceId }) => new Promise((resolve, reject) => {
  getTokenDetailsRequest(serviceId)
    .then(({ token }) => {
      const contract = getGenericErc20Contract(token);

      const fn = contract.methods
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
      notifyError();
    });
});

export const checkAndApproveToken = ({ account, chainId, id }) => new Promise((resolve, reject) => {
  hasSufficientTokenRequest({
    account,
    chainId,
    serviceId: id,
  })
    .then((hasTokenBalance) => {
      if (!hasTokenBalance) {
        approveToken({
          account,
          chainId,
          serviceId: id,
        })
          .then((response) => {
            resolve(response);
          })
          .catch((e) => {
            reject(e);
          });
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

/**
 * returns true if the user has sufficient token balance
 */

// NOTE: this function is used only for testing
export const mintTokenRequest = ({ account, serviceId }) => new Promise((resolve, reject) => {
  getTokenDetailsRequest(serviceId)
    .then(({ token }) => {
      const contract = getGenericErc20Contract(token);

      const fn = contract.methods
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

  const fn = contract.methods
    .activateRegistration(id)
    .send({ from: account, value: deposit });

  sendTransaction(fn, account)
    .then((response) => {
      notifySuccess('Activated Successfully');
      resolve(response);
    })
    .catch((e) => {
      reject(e);
      notifyError();
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
          const info = await contract.methods
            .getInstancesForAgentId(id, agentId)
            .call();
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
      contract.methods
        .registerAgents(serviceId, agentInstances, agentIds)
        .send({
          from: account,
          value: totalBonds[0],
        })
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
      const bond = await contract.methods.getAgentBond(id, agentId).call();
      return bond;
    }),
  );
};

// export const getTokenBondRequest = (id, agentIds) => new Promise((resolve, reject) => {
//   const contract = getServiceRegistryTokenUtilityContract();

//   contract.methods
//     .getAgentInstances(id)
//     .call()
//     .then(async (response) => {
//       console.log(response);
//     // const data = await Promise.all(
//     //   (response?.agentInstances || []).map(async (key, index) => {
//     //     const operatorAddress = await contract.methods
//     //       .mapAgentInstanceOperators(key)
//     //       .call();
//     //     return {
//     //       id: `agent-instance-row-${index + 1}`,
//     //       operatorAddress,
//     //       agentInstance: key,
//     //     };
//     //   }),
//     // );
//     // resolve(data);
//     })
//     .catch((e) => {
//       reject(e);
//     });

//   contract.methods
//     .getAgentBond(id)
//     .call()
//     .then((response) => {
//       resolve(response);
//     })
//     .catch((e) => {
//       reject(e);
//       notifyError('Error occured on getting token bond');
//     });
// });

/* ----- step 3 functions ----- */
export const getServiceAgentInstances = (id) => new Promise((resolve, reject) => {
  const contract = getServiceContract();

  contract.methods
    .getAgentInstances(id)
    .call()
    .then((response) => {
      resolve(response?.agentInstances);
    })
    .catch((e) => {
      reject(e);
    });
});

export const onStep3Deploy = (account, id, radioValue, payload = '0x') => new Promise((resolve, reject) => {
  const contract = getServiceManagerContract();

  contract.methods
    .deploy(id, radioValue, payload)
    .send({ from: account })
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

  contract.methods
    .getAgentInstances(id)
    .call()
    .then(async (response) => {
      const data = await Promise.all(
        (response?.agentInstances || []).map(async (key, index) => {
          const operatorAddress = await contract.methods
            .mapAgentInstanceOperators(key)
            .call();
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

  contract.methods
    .unbond(id)
    .send({ from: account })
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

  contract.methods
    .mapServiceIdOperatorsCheck(serviceId)
    .call()
    .then((response) => {
      // if true: it is whitelisted by default
      // else we can whitelist using the input field
      resolve(response);
    })
    .catch((e) => {
      reject(e);
      notifyError('Error occured on checking operator whitelist');
    });
});

export const checkIfServiceIsWhitelisted = (serviceId, operatorAddress) => new Promise((resolve, reject) => {
  const contract = getOperatorWhitelistContract();

  contract.methods
    .isOperatorWhitelisted(serviceId, operatorAddress)
    .call()
    .then((response) => {
      console.log(response);
      resolve(response);
    })
    .catch((e) => {
      reject(e);
      notifyError('Error occured on checking operator whitelist');
    });
});

// setOperatorsStatuses(serviceId, operatorAddresses, operatorStatuses, true)
export const setOperatorsStatusesRequest = ({
  account,
  serviceId,
  operatorAddresses,
  operatorStatuses,
}) => new Promise((resolve, reject) => {
  const contract = getOperatorWhitelistContract();

  contract.methods
    .setOperatorsStatuses(
      serviceId,
      operatorAddresses,
      operatorStatuses,
      true,
    )
    .send({ from: account })
    .then((response) => {
      console.log(response);
      resolve(response);
    })
    .catch((e) => {
      reject(e);
      notifyError('Error occured on checking operator whitelist');
    });
});

export const setOperatorsCheckRequest = ({ account, serviceId, isChecked }) => new Promise((resolve, reject) => {
  const contract = getOperatorWhitelistContract();

  contract.methods
    .setOperatorsCheck(serviceId, isChecked)
    .send({ from: account })
    .then((response) => {
      console.log(response);
      resolve(response);
    })
    .catch((e) => {
      reject(e);
      notifyError('Error occured on checking operator whitelist');
    });
});

/**
 * TODO:
 * agentInstances can be empty even if agentInstances are added in step 2
 * - Even if 1 agentInstances is present, rest of the agentInstances can be empty
 */
