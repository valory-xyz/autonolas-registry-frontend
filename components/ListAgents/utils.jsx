import { getMechMinterContract, getAgentContract } from 'common-util/Contracts';
import { getFirstAndLastIndex } from 'common-util/functions';
import { getListByAccount } from 'common-util/ContractUtils/myList';
import { sendTransaction } from 'common-util/functions/sendTransaction';

// --------- HELPER METHODS ---------
export const getAgentOwner = async (agentId) => {
  const contract = getAgentContract();
  const owner = await contract.methods.ownerOf(agentId).call();
  return owner;
};

export const getAgentDetails = async (agentId) => {
  const contract = getAgentContract();
  const information = await contract.methods.getUnit(agentId).call();
  return information;
};

// --------- CONTRACT METHODS ---------
export const getTotalForAllAgents = async () => {
  const contract = getAgentContract();
  const total = await contract.methods.totalSupply().call();
  return total;
};

export const getTotalForMyAgents = async (account) => {
  const contract = getAgentContract();
  const total = await contract.methods.balanceOf(account).call();
  return total;
};

export const getFilteredAgents = async (searchValue, account) => {
  const contract = getAgentContract();
  const total = await getTotalForAllAgents();
  const list = await getListByAccount({
    searchValue,
    total,
    getUnit: contract.methods.getUnit().call,
    getOwner: getAgentOwner,
    account,
  });
  return list;
};

export const getAgents = async (total, nextPage) => {
  const contract = getAgentContract();

  const allAgentsPromises = [];
  const { first, last } = getFirstAndLastIndex(total, nextPage);
  for (let i = first; i <= last; i += 1) {
    allAgentsPromises.push(contract.methods.getUnit(`${i}`).call());
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
  const contract = getAgentContract();
  const response = await contract.methods.getUpdatedHashes(id).call();
  return response;
};

export const updateAgentHashes = async (account, id, newHash) => {
  const contract = getMechMinterContract();

  // 0 to indicate `agents`
  const fn = contract.methods.updateHash('0', id, `0x${newHash}`).send({
    from: account,
    gasLimit: 1000000,
  });
  await sendTransaction(fn, account);
  return null;
};

export const getTokenUri = async (id) => {
  const contract = getAgentContract();
  const response = await contract.methods.tokenURI(id).call();
  return response;
};
