import { getServiceContract } from 'common-util/Contracts';

export const getServiceDetails = (id) => new Promise((resolve, reject) => {
  const contract = getServiceContract();

  // TODO: check if service exists
  contract.methods
    .getServiceInfo(id)
    .call()
    .then((information) => {
      resolve(information);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

export const getServicesByAccount = (account) => new Promise((resolve, reject) => {
  const contract = getServiceContract();

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
export const getServices = () => new Promise((resolve, reject) => {
  const contract = getServiceContract();

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

// for services, hash is hardcoded in frontend
export const getServiceHash = (values) => ({
  hash: `0x${values.hash || '0'.repeat(64)}`,
  hashFunction: '0x12',
  size: '0x20',
});
