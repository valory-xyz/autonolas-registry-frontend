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
export const getServiceOwner = async (id) => {
  const contract = await getServiceContract();
  const response = await contract.ownerOf(id);
  return response;
};

// --------- utils ---------
export const getServiceDetails = async (id) => {
  const contract = await getServiceContract();
  const information = await contract.getService(id);
  const owner = await getServiceOwner(id);
  return { ...information, owner };
};

export const getTotalForMyServices = async (account) => {
  const contract = await getServiceContract();
  const total = await contract.balanceOf(account);
  return total;
};

/**
 * Function to return all services
 */
export const getTotalForAllServices = async () => {
  const contract = await getServiceContract();
  const total = await contract.totalSupply();
  return total;
};

export const getServices = async (total, nextPage, fetchAll = false) => {
  const contract = await getServiceContract();

  const existsPromises = [];

  const first = fetchAll ? 1 : (nextPage - 1) * TOTAL_VIEW_COUNT + 1;
  const last = fetchAll ? total : Math.min(nextPage * TOTAL_VIEW_COUNT, total);

  for (let i = first; i <= last; i += 1) {
    const result = contract.exists(`${i}`);
    existsPromises.push(result);
  }

  const existsResult = await Promise.allSettled(existsPromises);
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

  return results;
};

export const getFilteredServices = async (searchValue, account) => {
  const total = await getTotalForAllServices();
  const list = await getServices(
    total,
    Math.round(total / TOTAL_VIEW_COUNT + 1),
    true,
  );

  return new Promise((resolve) => {
    const filteredList = filterByOwner(list, { searchValue, account });
    resolve(filteredList);
  });
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

export const getServiceHashes = async (id) => {
  const contract = await getServiceContract();
  const information = await contract.getPreviousHashes(id);
  return information;
};

export const getTokenUri = async (id) => {
  const contract = await getServiceContract();
  const response = await contract.tokenURI(id);
  return response;
};

export const getTokenAddressRequest = async (id) => {
  const response = await getTokenDetailsRequest(id);
  return response.token === DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS
    ? DEFAULT_SERVICE_CREATION_ETH_TOKEN
    : response.token;
};
