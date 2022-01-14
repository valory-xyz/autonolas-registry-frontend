import Web3 from 'web3';
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
    .then((length) => {
      const promises = [];
      for (let i = 0; i < length; i += 1) {
        const serviceId = `${i + 1}`;
        const result = contract.methods.getServiceInfo(serviceId).call();
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
      const { maxServiceId } = total;
      const existsPromises = [];

      for (let i = 1; i <= maxServiceId; i += 1) {
        const result = contract.methods.exists(`${i}`).call();
        existsPromises.push(result);
      }

      Promise.allSettled(existsPromises).then(async (existsResult) => {
        // filter services which don't exists (deleted or destroyed)
        const validTokenIds = [];
        existsResult.forEach((item, index) => {
          const serviceId = `${index + 1}`;
          if (item.status === 'fulfilled' && !!item.value) {
            validTokenIds.push(serviceId);
          }
        });

        // list of promises of valid service
        const serviceListPromises = [];
        validTokenIds.forEach((id) => {
          const result = contract.methods.getServiceInfo(id).call();
          serviceListPromises.push(result);
        });

        Promise.all(serviceListPromises).then((results) => {
          resolve(results);
        });
      });
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});
