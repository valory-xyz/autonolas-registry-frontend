import { notification } from 'antd';
import {
  getServiceContract,
  getServiceManagerContract,
} from 'common-util/Contracts';
// import {
//   convertStringToArray,
// } from 'common-util/List/ListCommon';

const notifyError = () => notification.error({ message: 'Some error occured' });


/* ----- common/helper functions ----- */
export const onTerminate = (account, id) => new Promise((resolve, reject) => {
  const contract = getServiceManagerContract();

  contract.methods
    .terminate(id)
    .send({ from: account })
    .then((information) => {
      resolve(information);
      notification.success({ message: 'Terminated Successfully' });
    })
    .catch((e) => {
      reject(e);
      notifyError();
    });
});

/* ----- step 1 functions ----- */
export const getServiceOwner = (id) => new Promise((resolve, reject) => {
  const contract = getServiceContract();

  contract.methods
    .ownerOf(id)
    .call()
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

export const onActivateRegistration = (account, id, deposit) => new Promise((resolve, reject) => {
  const contract = getServiceManagerContract();

  contract.methods
    .activateRegistration(id)
    .send({ from: account, value: deposit })
    .then((information) => {
      resolve(information);
    })
    .catch((e) => {
      reject(e);
    });
});

/* ----- step 2 functions ----- */
export const getStep2DataSource = (id, agentIds) => new Promise((resolve, reject) => {
  const contract = getServiceContract();

  contract.methods
    .getAgentParams(id)
    .call()
    .then(async (response) => {
      // params.agentParams.slots[i] = total initial available Slots for the i-th service.agentIds;
      const slotsArray = [];
      const bondsArray = [];
      for (let i = 0; i < response.agentParams.length; i += 1) {
        const { slots, bond } = response.agentParams[i];
        slotsArray.push(slots);
        bondsArray.push(bond);
      }

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
        availableSlots:
            Number(slotsArray[i]) - Number(numAgentInstancesArray[i]),
        totalSlots: slotsArray[i],
        agentAddresses: null,
      }));

      resolve(dateSource);
    })
    .catch((e) => {
      reject(e);
    });
});

/**
 * for each agentIds =>
 * TOOD: gets bonds & accumlate
 */


export const onStep2RegisterAgents = (account, id) => new Promise((resolve, reject) => {
  const contract = getServiceManagerContract();
  // TODO: value types in table
  const value = {
    agentInstances: ['0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82'],
    agentIds: ['1'],
  };

  contract.methods
    .registerAgents(id, value.agentInstances, value.agentIds)
    .send({ from: account, value: '1' }) // TODO: value to be calulcated
    .then((information) => {
      resolve(information);
    })
    .catch((e) => {
      reject(e);
    });
});


/* ----- step 3 functions ----- */
export const onStep3Deploy = (account, id, radioValue) => new Promise((resolve, reject) => {
  const contract = getServiceManagerContract();

  contract.methods
    .deploy(id, radioValue, '0x')
    .send({ from: account })
    .then((information) => {
      resolve(information);
    })
    .catch((e) => {
      reject(e);
    });
});

/* ----- step 4 functions ----- */

/* ----- step 5 functions ----- */
export const onStep5Unbond = (account, id) => new Promise((resolve, reject) => {
  const contract = getServiceManagerContract();

  contract.methods
    .unbond(id)
    .send({ from: account })
    .then((information) => {
      resolve(information);
      notification.success({ message: 'Unbonded Successfully' });
    })
    .catch((e) => {
      notifyError();
      reject(e);
    });
});

/**
 * TODO: add notification for activate, terminate
 *
 */
