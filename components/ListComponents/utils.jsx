import {
  getMechMinterContract,
  getComponentContract,
} from 'common-util/Contracts';
import { getListByAccount } from 'common-util/ContractUtils/myList';
import { getFirstAndLastIndex } from 'common-util/functions';
import { sendTransaction } from 'common-util/functions/sendTransaction';

// --------- HELPER METHODS ---------
export const getComponentOwner = async (id) => {
  const contract = await getComponentContract();
  const owner = await contract.methods.ownerOf(id).call();
  return owner;
};

export const getComponentDetails = async (id) => {
  const contract = await getComponentContract();
  const information = await contract.methods.getUnit(id).call();
  return information;
};

// --------- CONTRACT METHODS ---------
export const getTotalForAllComponents = async () => {
  const contract = await getComponentContract();
  const total = await contract.methods.totalSupply().call();
  return total;
};

export const getTotalForMyComponents = async (account) => {
  const contract = await getComponentContract();
  const balance = await contract.methods.balanceOf(account).call();
  return balance;
};

export const getFilteredComponents = async (searchValue, account) => {
  const contract = await getComponentContract();
  const total = await getTotalForAllComponents();
  const list = await getListByAccount({
    searchValue,
    total,
    getUnit: contract.methods.getUnit().call,
    getOwner: getComponentOwner,
    account,
  });
  return list;
};

export const getComponents = async (total, nextPage) => {
  const contract = await getComponentContract();

  const allComponentsPromises = [];
  const { first, last } = getFirstAndLastIndex(total, nextPage);
  for (let i = first; i <= last; i += 1) {
    allComponentsPromises.push(contract.methods.getUnit(`${i}`).call());
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
  const response = await contract.methods.getUpdatedHashes(id).call();
  return response;
};

export const updateComponentHashes = async (account, id, newHash) => {
  const contract = getMechMinterContract();

  // 0 to indicate `components`
  const fn = contract.methods.updateHash('0', id, `0x${newHash}`).send({
    from: account,
  });
  await sendTransaction(fn, account);
  return null;
};

export const getTokenUri = async (id) => {
  const contract = await getComponentContract();
  const response = await contract.methods.tokenURI(id).call();
  return response;
};
