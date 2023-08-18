import { notification } from 'antd';
import { TOTAL_VIEW_COUNT } from 'util/constants';
import { getMechMinterContract, getAgentContract } from 'common-util/Contracts';
import { getListByAccount } from 'common-util/ContractUtils/myList';
import { sendTransaction } from 'common-util/functions/sendTransaction';

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
      reject(e);
    });
});

/**
 * helper to return the list of details (table in index page)
 */
const getAgentsHelper = (startIndex, promiseList, resolve, reject) => {
  Promise.all(promiseList)
    .then(async (list) => {
      const results = await Promise.all(
        list.map(async (info, i) => {
          const owner = await getAgentOwner(`${startIndex + i}`);
          return { ...info, owner };
        }),
      );
      resolve(results);
    })
    .catch((e) => {
      reject(e);
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

export const getTotalForMyAgents = (account) => new Promise((resolve, reject) => {
  const contract = getAgentContract();
  contract.methods
    .balanceOf(account)
    .call()
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      reject(e);
    });
});

/**
 * Function to return all agents
 */
export const getTotalForAllAgents = () => new Promise((resolve, reject) => {
  const contract = getAgentContract();
  contract.methods
    .totalSupply()
    .call()
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      reject(e);
    });
});

export const getAgents = (total, nextPage) => new Promise((resolve, reject) => {
  const contract = getAgentContract();

  try {
    const allAgentsPromises = [];
    const first = (nextPage - 1) * TOTAL_VIEW_COUNT + 1;
    const last = Math.min(nextPage * TOTAL_VIEW_COUNT, total);
    for (let i = first; i <= last; i += 1) {
      const agentId = `${i}`;
      const result = contract.methods.getUnit(agentId).call();
      allAgentsPromises.push(result);
    }

    getAgentsHelper(first, allAgentsPromises, resolve, reject);
  } catch (e) {
    console.error(e);
    reject(e);
  }
});

export const getFilteredAgents = async (searchValue, account) => {
  const contract = getAgentContract();
  const total = await getTotalForAllAgents();
  const { getUnit } = contract.methods;

  return getListByAccount({
    searchValue,
    total,
    getUnit,
    getOwner: getAgentOwner,
    account,
  });
};

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

  const fn = contract.methods
    .updateHash('1', id, `0x${newHash}`)
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
