import { getMechMinterContract, getAgentContract } from 'common-util/Contracts';
import { getFirstAndLastIndex, notifySuccess } from 'common-util/functions';
import { getListByAccount } from 'common-util/ContractUtils/myList';
import { triggerTransaction } from 'common-util/functions/triggerTransaction';

// --------- HELPER METHODS ---------
export const getAgentOwner = async (agentId) => {
  const contract = await getAgentContract();
  const owner = await contract.ownerOf(agentId);
  return owner;
};

export const getAgentDetails = async (agentId) => {
  const contract = await getAgentContract();
  const information = await contract.getUnit(agentId);
  return information;
};

// --------- contract methods ---------
export const getTotalForAllAgents = async () => {
  const contract = await getAgentContract();
  const total = await contract.totalSupply();
  return total;
};

export const getTotalForMyAgents = async (account) => {
  const contract = await getAgentContract();
  const total = await contract.balanceOf(account);
  return total;
};

export const getFilteredAgents = async (searchValue, account) => {
  const contract = await getAgentContract();
  const total = await getTotalForAllAgents();

  return getListByAccount({
    searchValue,
    total,
    getUnit: contract.getUnit,
    getOwner: getAgentOwner,
    account,
  });
};

export const getAgents = async (total, nextPage) => {
  const contract = await getAgentContract();

  const allAgentsPromises = [];
  const { first, last } = getFirstAndLastIndex(total, nextPage);
  for (let i = first; i <= last; i += 1) {
    allAgentsPromises.push(contract.getUnit(`${i}`));
  }

  const agents = await Promise.allSettled(allAgentsPromises);
  const results = await Promise.all(
    agents.map(async (info, i) => {
      const owner = await getAgentOwner(`${first + i}`);
      return { ...info.value, owner };
    }),
  );

  return results;
};

export const getAgentHashes = async (id) => {
  const contract = await getAgentContract();
  const response = await contract.getUpdatedHashes(id);
  return response;
};

export const updateAgentHashes = async (account, id, newHash) => {
  const contract = await getMechMinterContract();

  // TODO: fix me
  // 0 to indicate `agents`
  const fn = await contract.updateHash('0', id, `0x${newHash}`, {
    from: account,
    gasLimit: 1000000,
  });
  await triggerTransaction(fn, account);
  notifySuccess('Hash updated');
};

export const getTokenUri = async (id) => {
  const contract = await getAgentContract();
  const response = await contract.tokenURI(id);
  return response;
};
