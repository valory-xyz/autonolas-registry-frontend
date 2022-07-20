import { getServiceContract } from 'common-util/Contracts';
import {
  getBytes32FromIpfsHash,
  convertStringToArray,
} from 'common-util/List/ListCommon';

// --------- HELPER METHODS ---------
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

// --------- utils ---------
export const getServiceDetails = (id) => new Promise((resolve, reject) => {
  const contract = getServiceContract();

  // TODO: check if service exists
  contract.methods
    .getService(id)
    .call()
    .then((information) => {
      resolve(information);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

export const getServicesByAccount = (account) => new Promise((resolve, reject) => {
  const contract = getServiceContract();

  contract.methods
    .balanceOf(account)
    .call()
    .then(async (length) => {
      const results = await Promise.all(
        [...Array(length).keys()].map(async (_e, index) => {
          const id = `${index + 1}`;
          const info = await getServiceDetails(id);
          const owner = await getServiceOwner(id);
          return { ...info, owner };
        }),
      );

      resolve(results);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

/**
 * Function to return all services
 */
export const getServices = () => new Promise((resolve, reject) => {
  const contract = getServiceContract();

  contract.methods
    .totalSupply()
    .call()
    .then((total) => {
      const existsPromises = [];

      for (let i = 1; i <= Number(total); i += 1) {
        const result = contract.methods.exists(`${i}`).call();
        existsPromises.push(result);
      }

      Promise.allSettled(existsPromises).then(async (existsResult) => {
        // filter services which don't exists (deleted or destroyed)
        const validTokenIds = [];
        existsResult.forEach((item, index) => {
          const serviceId = `${index + 1}`;
          if (item.status === 'fulfilled' && !!item.value) {
            validTokenIds.push(serviceId);
          }
        });

        // list of promises of valid service
        const results = await Promise.all(
          validTokenIds.map(async (id) => {
            const info = await getServiceDetails(id);
            const owner = await getServiceOwner(id);
            return { ...info, owner };
          }),
        );

        resolve(results);
      });
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

// for services, hash is hardcoded in frontend
export const getServiceHash = (values) => ({
  hash: getBytes32FromIpfsHash(values.hash),
  hashFunction: '0x12',
  size: '0x20',
});

/**
 *
 * 2D array of agent params
 * eg.
 * agent_num_slots = 1, 2
 * bonds = 100, 200
 * @returns [[1, 100], [2, 200]]
 */
export const getAgentParams = (values) => {
  const agentNumSlots = convertStringToArray(values.agent_num_slots);
  const bonds = convertStringToArray(values.bonds);
  return bonds.map((bond, index) => [agentNumSlots[index], bond]);
};

export const getServiceHashes = (id) => new Promise((resolve, reject) => {
  const contract = getServiceContract();

  contract.methods
    .getPreviousHashes(id)
    .call()
    .then((information) => {
      resolve(information);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});
