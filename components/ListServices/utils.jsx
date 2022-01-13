import Web3 from 'web3';
import uniq from 'lodash/uniq';
import {
  SERVICE_REGISTRY_ADDRESS,
  SERVICE_REGISTRY,
} from 'common-util/AbiAndAddresses/serviceRegistry';

export const getServices = (account) => new Promise((resolve, reject) => {
  const web3 = new Web3(window.web3.currentProvider);
  const contract = new web3.eth.Contract(
    SERVICE_REGISTRY.abi,
    SERVICE_REGISTRY_ADDRESS,
  );

  contract.methods
    .balanceOf(account)
    .call()
    .then(async (length) => {
      const promises = [];
      for (let i = 1; i <= length; i += 1) {
        const serviceId = `${i}`;
        const result = contract.methods.getServiceInfo(serviceId).call();
        promises.push(result);
      }

      Promise.all(promises).then((results) => {
        resolve(results);
      });
    })
    .catch((e) => {
      console.error(e); /* eslint-disable-line no-console */
      reject(e);
    });
});

/**
 * Function to return all services
 */
export const getEveryServices = () => new Promise((resolve, reject) => {
  const web3 = new Web3(window.web3.currentProvider);
  const contract = new web3.eth.Contract(
    SERVICE_REGISTRY.abi,
    SERVICE_REGISTRY_ADDRESS,
  );

  contract.methods
    .totalSupply()
    .call()
    .then((total) => {
      const ownersListPromises = [];
      for (let i = 1; i <= total; i += 1) {
        const serviceId = `${i}`;
        const result = contract.methods.ownerOf(serviceId).call();
        ownersListPromises.push(result);
      }

      Promise.all(ownersListPromises).then(async (ownersList) => {
        const uniqueOwners = uniq(ownersList);
        const allServicePromises = [];
        for (let i = 0; i < uniqueOwners.length; i += 1) {
          const serviceInfo = getServices(uniqueOwners[i]);
          allServicePromises.push(serviceInfo);
        }
        // console.log(allServicePromises);

        /* filtering out if either one of request is failed */
        Promise.allSettled(allServicePromises).then((results) => {
          const list = results
            .filter((result) => result.status === 'fulfilled')
            .map((item) => item.value);
            // console.log(results);
          resolve(list.length === 0 ? [] : list);
        });
      });
    })
    .catch((e) => {
      console.error(e); /* eslint-disable-line no-console */
      reject(e);
    });
});
