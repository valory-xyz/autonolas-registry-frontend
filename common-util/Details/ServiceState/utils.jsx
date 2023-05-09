import { notification } from 'antd/lib';
import { compact } from 'lodash';
import {
  getServiceContract,
  getServiceManagerContract,
} from 'common-util/Contracts';
import { sendTransaction } from 'common-util/functions/sendTransaction';

const notifySuccess = (message = 'Terminated Successfully') => notification.success({ message });
const notifyError = (message = 'Some error occured') => notification.error({ message });

/* ----- helper functions ----- */

// params.agentParams.slots[i] = total initial available Slots for the i-th service.agentIds;

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

      let totalBonds = 0;
      (tableDataSource || []).forEach((data) => {
        const { agentAddresses, bond } = data;

        /**
           * get the number of addresses
           * g1. ['0x123', '0x456'] => 2
           * eg2. ['0x123', '0x456', ''] => 2 // empty string (falsy) is ignored
           */
        const numberOfAgentAddress = compact(
          (agentAddresses || '').split(','),
        ).length;

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

/* ----- step 1 functions ----- */
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
      console.log({
        serviceId,
        agentInstances,
        agentIds,
        account,
        value: `${totalBonds}`,
      });

      contract.methods
        .registerAgents(serviceId, agentInstances, agentIds)
        .send({ from: account, value: `${totalBonds}` })
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
