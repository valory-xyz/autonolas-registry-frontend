import Web3 from 'web3';
import {
  COMPONENT_REGISTRY_ADDRESS,
  COMPONENT_REGISTRY,
} from 'common-util/AbiAndAddresses/componentRegistry';

export const getComponents = (account) => new Promise((resolve, reject) => {
  const web3 = new Web3(window.web3.currentProvider);
  const contract = new web3.eth.Contract(
    COMPONENT_REGISTRY.abi,
    COMPONENT_REGISTRY_ADDRESS,
  );

  contract.methods
    .balanceOf(account)
    .call()
    .then((length) => {
      const promises = [];
      for (let i = 1; i <= length; i += 1) {
        const componentId = `${i}`;
        const result = contract.methods.getComponentInfo(componentId).call();
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
export const getEveryComponents = () => new Promise((resolve, reject) => {
  const web3 = new Web3(window.web3.currentProvider);
  const contract = new web3.eth.Contract(
    COMPONENT_REGISTRY.abi,
    COMPONENT_REGISTRY_ADDRESS,
  );

  contract.methods
    .totalSupply()
    .call()
    .then((total) => {
      const allComponentsPromises = [];
      for (let i = 1; i <= total; i += 1) {
        const componentId = `${i}`;
        const result = contract.methods.getComponentInfo(componentId).call();
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
