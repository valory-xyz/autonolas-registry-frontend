import { getAgentContract } from 'common-util/Contracts';

export const getAgentsByAccount = (account) => new Promise((resolve, reject) => {
  const contract = getAgentContract();

  contract.methods
    .balanceOf(account)
    .call()
    .then((length) => {
      const promises = [];
      for (let i = 1; i <= length; i += 1) {
        const agentId = `${i}`;
        const result = contract.methods.getAgentInfo(agentId).call();
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
        const result = contract.methods.getAgentInfo(agentId).call();
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
