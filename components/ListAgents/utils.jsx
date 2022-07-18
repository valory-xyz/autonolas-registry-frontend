import { notification } from 'antd';
import { getMechMinterContract, getAgentContract } from 'common-util/Contracts';
import { getBytes32FromIpfsHash } from 'common-util/List/ListCommon';

// --------- HELPER METHODS ---------
export const getAgentOwner = (agentId) => new Promise((resolve, reject) => {
  const contract = getAgentContract();

  contract.methods
    .ownerOf(agentId)
    .call()
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
const getAgentsHelper = (promiseList, resolve) => {
  Promise.all(promiseList).then(async (list) => {
    const results = await Promise.all(
      list.map(async (info, i) => {
        const owner = await getAgentOwner(`${i + 1}`);
        return { ...info, owner };
      }),
    );
    resolve(results);
  });
};

// --------- utils ---------
export const getAgentDetails = (agentId) => new Promise((resolve, reject) => {
  const contract = getAgentContract();

  contract.methods
    .getUnit(agentId)
    .call()
    .then((information) => {
      resolve(information);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

export const getAgentsByAccount = (account) => new Promise((resolve, reject) => {
  const contract = getAgentContract();

  contract.methods
    .balanceOf(account)
    .call()
    .then((length) => {
      const promises = [];
      for (let i = 1; i <= length; i += 1) {
        const agentId = `${i}`;
        const result = contract.methods.getUnit(agentId).call();
        promises.push(result);
      }

      getAgentsHelper(promises, resolve);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

/**
 * Function to return all agents
 */
export const getAgents = () => new Promise((resolve, reject) => {
  const contract = getAgentContract();

  contract.methods
    .totalSupply()
    .call()
    .then((total) => {
      const allAgentsPromises = [];
      for (let i = 1; i <= total; i += 1) {
        const agentId = `${i}`;
        const result = contract.methods.getUnit(agentId).call();
        allAgentsPromises.push(result);
      }

      getAgentsHelper(allAgentsPromises, resolve);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

export const getAgentHashes = (agentId) => new Promise((resolve, reject) => {
  const contract = getAgentContract();

  contract.methods
    .getHashes(agentId)
    .call()
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

export const updateAgentHashes = (account, id, newHash) => {
  const contract = getMechMinterContract();

  const hashObject = {
    hash: getBytes32FromIpfsHash(newHash),
    hashFunction: '0x12',
    size: '0x20',
  };

  contract.methods
    .updateAgentHash(id, hashObject)
    .send({ from: account })
    .then(() => {
      notification.success({ message: 'Hash Updated' });
    })
    .catch((e) => {
      notification.error({ message: 'Some error occured' });
      console.error(e);
    });
};
