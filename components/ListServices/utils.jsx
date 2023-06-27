import {
  DEFAULT_SERVICE_CREATION_ETH_TOKEN,
  TOTAL_VIEW_COUNT,
  DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS,
} from 'util/constants';
import { getServiceContract } from 'common-util/Contracts';
import { convertStringToArray } from 'common-util/List/ListCommon';
import { filterByOwner } from 'common-util/ContractUtils/myList';
import { getTokenDetailsRequest } from 'common-util/Details/ServiceState/utils';

// --------- HELPER METHODS ---------
export const getServiceOwner = (id) => new Promise((resolve, reject) => {
  const contract = getServiceContract();

  console.log('inside service owner call', id);
  contract.methods
    .ownerOf(id)
    .call()
    .then((response) => {
      console.log('service owner response', response);
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
  console.log('inside service DETAILS call', id);

  contract.methods
    .getService(id)
    .call()
    .then(async (information) => {
      const owner = await getServiceOwner(id);
      console.log('inside service DETAILS response', id);
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
      console.log({ totalSupply: response });
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
    // const last = 7;
    const last = fetchAll
      ? total
      : Math.min(nextPage * TOTAL_VIEW_COUNT, total);

    for (let i = first; i <= last; i += 1) {
      const result = contract.methods.exists(`${i}`).call();
      existsPromises.push(result);
    }

    console.log({
      first, last, total, existsPromises,
    });

    // Promise.race([
    //   new Promise((_, r) => setTimeout(() => r(new Error('Timeout')), 10000)),
    //   Promise.allSettled(existsPromises),
    // ]).then(async (existsResult) => {
    //   console.log({ existsResult });
    // });

    Promise.allSettled(existsPromises).then(async (existsResult) => {
      console.log({ existsResult });
      // filter services which don't exists (deleted or destroyed)
      const validTokenIds = [];
      existsResult.forEach((item, index) => {
        const serviceId = `${first + index}`;
        if (item.status === 'fulfilled' && !!item.value) {
          validTokenIds.push(serviceId);
        }
      });

      console.log({ validTokenIds });

      // list of promises of valid service
      const results = await Promise.all(
        validTokenIds.map(async (id) => {
          console.log('inside validTokenIds', id);
          const info = await getServiceDetails(id);
          console.log(info);
          // const info = {};
          const owner = await getServiceOwner(id);
          console.log(owner);
          // const owner = '0x000000';
          return { ...info, id, owner };
        }),
      );

      console.log({ results });

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

export const getTokenAddressRequest = (id) => new Promise((resolve, reject) => {
  getTokenDetailsRequest(id)
    .then((response) => {
      resolve(
        response.token === DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS
          ? DEFAULT_SERVICE_CREATION_ETH_TOKEN
          : response.token,
      );
    })
    .catch((e) => {
      console.error('Error occured on getting token address');
      reject(e);
    });
});
