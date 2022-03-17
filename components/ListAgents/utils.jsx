import { notification } from 'antd';
import { getMechMinterContract, getAgentContract } from 'common-util/Contracts';
import { getBytes32FromIpfsHash } from 'common-util/List/ListCommon';

export const getAgentDetails = (agentId) => new Promise((resolve, reject) => {
  const contract = getAgentContract();

  contract.methods
    .getInfo(agentId)
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
        const result = contract.methods.getInfo(agentId).call();
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
        const result = contract.methods.getInfo(agentId).call();
        allAgentsPromises.push(result);
      }

      Promise.all(allAgentsPromises).then((allAgentsList) => {
        resolve(allAgentsList);
      });
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
