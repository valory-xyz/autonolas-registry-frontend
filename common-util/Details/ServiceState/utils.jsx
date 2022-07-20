import {
  getServiceContract,
  getServiceManagerContract,
} from 'common-util/Contracts';
// import {
//   getBytes32FromIpfsHash,
//   convertStringToArray,
// } from 'common-util/List/ListCommon';

/* ----- helper functions ----- */

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

export const onActivateRegistration = (id) => new Promise((resolve, reject) => {
  const contract = getServiceManagerContract();

  contract.methods
    .activateRegistration(id)
    .call()
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
      for (let i = 0; i < response.agentParams.length; i += 1) {
        const { slots } = response.agentParams[i];
        slotsArray.push(slots);
      }

      /**
       * then for each agent Id, you call instances = getInstancesForAgentId(serviceId, agentId):
       * instances.numAgentInstances will give you the number of occupied instances slots, so in
       * the Available Slots row you subtract params.agentParams.slots[i] -
       * instances.numAgentInstances, considering the same agentId. And as for Agent Addresses
       * for the correspondent Agent ID, just grab all the values from the: instances.agentInstances
       */
      const numAgentInstancesArray = await Promise.all(
        agentIds.map(async (agentId) => {
          const info = await contract.methods.getInstancesForAgentId(
            id,
            agentId,
          ).call();
          return info.numAgentInstances;
        }),
      );

      const dateSource = agentIds.map((aid, i) => ({
        key: aid,
        agentId: aid,
        availableSlots: Number(slotsArray[i]) - Number(numAgentInstancesArray[i]),
        totalSlots: slotsArray[i],
        agentAddresses: null,
      }));

      resolve(dateSource);
    })
    .catch((e) => {
      reject(e);
    });
});
