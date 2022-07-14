import { notification } from 'antd';
import {
  getMechMinterContract,
  getComponentContract,
} from 'common-util/Contracts';
import { getBytes32FromIpfsHash } from 'common-util/List/ListCommon';

export const getComponentDetails = (id) => new Promise((resolve, reject) => {
  const contract = getComponentContract();

  contract.methods
    .getUnit(id)
    .call()
    .then((information) => {
      resolve(information);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

export const getComponentsByAccount = (account) => new Promise((resolve, reject) => {
  const contract = getComponentContract();
  contract.methods
    .balanceOf(account)
    .call()
    .then((length) => {
      const promises = [];
      for (let i = 1; i <= length; i += 1) {
        const componentId = `${i}`;
        const result = contract.methods.getUnit(componentId).call();
        promises.push(result);
      }

      Promise.all(promises).then((results) => {
        resolve(results);
      });
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

/**
 * Function to return all components
 */
export const getComponents = () => new Promise((resolve, reject) => {
  const contract = getComponentContract();

  contract.methods
    .totalSupply()
    .call()
    .then((total) => {
      const allComponentsPromises = [];
      for (let i = 1; i <= total; i += 1) {
        const componentId = `${i}`;
        const result = contract.methods.getUnit(componentId).call();
        allComponentsPromises.push(result);
      }

      Promise.all(allComponentsPromises).then(async (allComponentsList) => {
        resolve(allComponentsList);
      });
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

export const getComponentHashes = (id) => new Promise((resolve, reject) => {
  const contract = getComponentContract();

  contract.methods
    .getUpdatedHashes(id)
    .call()
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
  contract.methods
    .updateHash('0', id, getBytes32FromIpfsHash(newHash))
    .send({ from: account })
    .then(() => {
      notification.success({ message: 'Hash Updated' });
    })
    .catch((e) => {
      notification.error({ message: 'Some error occured' });
      console.error(e);
    });
};

export const getComponentOwner = (id) => new Promise((resolve, reject) => {
  const contract = getComponentContract();

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
