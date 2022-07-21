import { notification } from 'antd';
import { getMechMinterContract, getAgentContract } from 'common-util/Contracts';

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
    .getUpdatedHashes(agentId)
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

  contract.methods
    .updateHash('0', id, newHash)
    .send({ from: account })
    .then(() => {
      notification.success({ message: 'Hash Updated' });
    })
    .catch((e) => {
      notification.error({ message: 'Some error occured' });
      console.error(e);
    });
};

export const getTokenUri = (id) => new Promise((resolve, reject) => {
  const contract = getAgentContract();

  contract.methods
    .tokenURI(id)
    .call()
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});
