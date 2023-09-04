import {
  getMechMinterContract,
  getComponentContract,
} from 'common-util/Contracts';
import { getListByAccount } from 'common-util/ContractUtils/myList';
import { getFirstAndLastIndex, notifySuccess } from 'common-util/functions';
import { triggerTransaction } from 'common-util/functions/triggerTransaction';

// --------- HELPER METHODS ---------
export const getComponentOwner = async (id) => {
  const contract = await getComponentContract();
  const owner = await contract.ownerOf(id);
  return owner;
};

export const getComponentDetails = async (id) => {
  const contract = await getComponentContract();
  const information = await contract.getUnit(id);
  return information;
};

// --------- contract methods ---------
export const getTotalForAllComponents = async () => {
  const contract = await getComponentContract();
  const total = await contract.totalSupply();
  return total;
};

export const getTotalForMyComponents = async (account) => {
  const contract = await getComponentContract();
  const balance = await contract.balanceOf(account);
  return balance;
};

export const getFilteredComponents = async (searchValue, account) => {
  const contract = await getComponentContract();
  const total = await getTotalForAllComponents();

  return getListByAccount({
    searchValue,
    total,
    getUnit: contract.getUnit,
    getOwner: getComponentOwner,
    account,
  });
};

export const getComponents = async (total, nextPage) => {
  const contract = await getComponentContract();

  const allComponentsPromises = [];
  const { first, last } = getFirstAndLastIndex(total, nextPage);
  for (let i = first; i <= last; i += 1) {
    allComponentsPromises.push(contract.getUnit(`${i}`));
  }

  const components = await Promise.allSettled(allComponentsPromises);
  const results = await Promise.all(
    components.map(async (info, i) => {
      const owner = await getComponentOwner(`${first + i}`);
      return { ...info.value, owner };
    }),
  );

  return results;
};

export const getComponentHashes = async (id) => {
  const contract = await getComponentContract();
  const response = await contract.getUpdatedHashes(id);
  return response;
};

export const updateComponentHashes = async (account, id, newHash) => {
  const contract = await getMechMinterContract();

  // 0 to indicate `components`
  const fn = await contract
    .updateHash('0', id, `0x${newHash}`)
    .send({ from: account });
  await triggerTransaction(fn, account);
  notifySuccess('Hash updated');
};

export const getTokenUri = async (id) => {
  const contract = await getComponentContract();
  const response = await contract.tokenURI(id);
  return response;
};
