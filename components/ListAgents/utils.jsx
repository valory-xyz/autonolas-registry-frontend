import Web3 from 'web3';
import {
  AGENT_REGISTRY_ADDRESS,
  AGENT_REGISTRY,
} from 'common-util/AbiAndAddresses/agentRegistry';

export const getAgents = (account) => new Promise((resolve, reject) => {
  const web3 = new Web3(window.web3.currentProvider);
  const contract = new web3.eth.Contract(
    AGENT_REGISTRY.abi,
    AGENT_REGISTRY_ADDRESS,
  );

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
export const getEveryAgents = () => new Promise((resolve, reject) => {
  const web3 = new Web3(window.web3.currentProvider);
  const contract = new web3.eth.Contract(
    AGENT_REGISTRY.abi,
    AGENT_REGISTRY_ADDRESS,
  );

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
