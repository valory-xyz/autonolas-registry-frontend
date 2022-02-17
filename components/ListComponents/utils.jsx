import { getComponentContract } from 'common-util/Contracts';

export const getComponentDetails = (id) => new Promise((resolve, reject) => {
  const contract = getComponentContract();

  contract.methods
    .getInfo(id)
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
        const result = contract.methods.getInfo(componentId).call();
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
        const result = contract.methods.getInfo(componentId).call();
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
