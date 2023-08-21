import { notification } from 'antd';
import {
  getMechMinterContract,
  getComponentContract,
} from 'common-util/Contracts';
import { getListByAccount } from 'common-util/ContractUtils/myList';
import { getFirstAndLastIndex } from 'common-util/functions';
import { sendTransaction } from 'common-util/functions/sendTransaction';

// --------- HELPER METHODS ---------
export const getComponentOwner = (id) => new Promise((resolve, reject) => {
  const contract = getComponentContract();

  contract
    .ownerOf(id)
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

/**
 * helper to return the list of details (table in index page)
 */
const getComponentsHelper = (startIndex, promiseList, resolve) => {
  Promise.all(promiseList).then(async (componentsList) => {
    const results = await Promise.all(
      componentsList.map(async (info, i) => {
        const owner = await getComponentOwner(`${startIndex + i}`);
        return { ...info, owner };
      }),
    );
    resolve(results);
  });
};

// --------- utils ---------
export const getComponentDetails = (id) => new Promise((resolve, reject) => {
  const contract = getComponentContract();

  contract
    .getUnit(id)
    .then((information) => {
      resolve(information);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

// totals
export const getTotalForAllComponents = () => new Promise((resolve, reject) => {
  const contract = getComponentContract();
  contract
    .totalSupply()
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      reject(e);
    });
});

export const getTotalForMyComponents = (account) => new Promise((resolve, reject) => {
  const contract = getComponentContract();
  contract
    .balanceOf(account)
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      reject(e);
    });
});

export const getFilteredComponents = async (searchValue, account) => {
  const contract = getComponentContract();
  const total = await getTotalForAllComponents();

  return getListByAccount({
    searchValue,
    total,
    getUnit: contract.getUnit,
    getOwner: getComponentOwner,
    account,
  });
};

/**
 * Function to return all components
 */
export const getComponents = (total, nextPage) => new Promise((resolve, reject) => {
  const contract = getComponentContract();

  try {
    const allComponentsPromises = [];

    const { first, last } = getFirstAndLastIndex(total, nextPage);
    for (let i = first; i <= last; i += 1) {
      const componentId = `${i}`;
      const result = contract.getUnit(componentId);
      allComponentsPromises.push(result);
    }

    getComponentsHelper(first, allComponentsPromises, resolve);
  } catch (e) {
    console.error(e);
    reject(e);
  }
});

export const getComponentHashes = (id) => new Promise((resolve, reject) => {
  const contract = getComponentContract();

  contract
    .getUpdatedHashes(id)
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

export const updateComponentHashes = (account, id, newHash) => {
  const contract = getMechMinterContract();

  // 0 to indicate `components`
  const fn = contract
    .updateHash('0', id, `0x${newHash}`)
    .send({ from: account });

  sendTransaction(fn, account)
    .then(() => {
      notification.success({ message: 'Hash Updated' });
    })
    .catch((e) => {
      notification.error({ message: 'Some error occured' });
      console.error(e);
    });
};

export const getTokenUri = (id) => new Promise((resolve, reject) => {
  const contract = getComponentContract();

  contract
    .tokenURI(id)
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});
