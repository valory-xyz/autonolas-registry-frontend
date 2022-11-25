import { TOTAL_VIEW_COUNT } from 'util/constants';
import { getServiceContract } from 'common-util/Contracts';
import { convertStringToArray } from 'common-util/List/ListCommon';
import { filterByOwner } from 'common-util/ContractUtils/myList';

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

  contract.methods
    .getService(id)
    .call()
    .then(async (information) => {
      const owner = await getServiceOwner(id);
      resolve({ ...information, owner });
    })
    .catch((e) => {
      reject(e);
    });
});

export const getTotalForMyServices = (account) => new Promise((resolve, reject) => {
  const contract = getServiceContract();
  contract.methods
    .balanceOf(account)
    .call()
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      reject(e);
    });
});

/**
 * Function to return all services
 */
export const getTotalForAllServices = () => new Promise((resolve, reject) => {
  const contract = getServiceContract();
  contract.methods
    .totalSupply()
    .call()
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      reject(e);
    });
});

export const getServices = (total, nextPage, fetchAll = false) => new Promise((resolve, reject) => {
  const contract = getServiceContract();

  try {
    const existsPromises = [];

    const first = fetchAll ? 1 : (nextPage - 1) * TOTAL_VIEW_COUNT + 1;
    const last = fetchAll
      ? total
      : Math.min(nextPage * TOTAL_VIEW_COUNT, total);

    for (let i = first; i <= last; i += 1) {
      const result = contract.methods.exists(`${i}`).call();
      existsPromises.push(result);
    }

    Promise.allSettled(existsPromises).then(async (existsResult) => {
      // filter services which don't exists (deleted or destroyed)
      const validTokenIds = [];
      existsResult.forEach((item, index) => {
        const serviceId = `${first + index}`;
        if (item.status === 'fulfilled' && !!item.value) {
          validTokenIds.push(serviceId);
        }
      });

      // list of promises of valid service
      const results = await Promise.all(
        validTokenIds.map(async (id) => {
          const info = await getServiceDetails(id);
          const owner = await getServiceOwner(id);
          return { ...info, id, owner };
        }),
      );

      resolve(results);
    });
  } catch (e) {
    console.error(e);
    reject(e);
  }
});

export const getFilteredServices = async (searchValue, account) => {
  const total = await getTotalForAllServices();
  const list = await getServices(
    total,
    Math.round(total / TOTAL_VIEW_COUNT + 1),
    true,
  );

  return new Promise((resolve) => resolve(filterByOwner(list, { searchValue, account })));
};

// for services, hash is hardcoded in frontend
export const getServiceHash = (values) => values.hash;

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

export const getTokenUri = (id) => new Promise((resolve, reject) => {
  const contract = getServiceContract();

  contract.methods
    .tokenURI(id)
    .call()
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});
