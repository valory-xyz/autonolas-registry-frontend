import Web3 from 'web3';
import uniq from 'lodash/uniq';
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
    .then(async (length) => {
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
      console.error(e); /* eslint-disable-line no-console */
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
      const ownersListPromises = [];
      for (let i = 1; i <= total; i += 1) {
        const agentId = `${i}`;
        const result = contract.methods.ownerOf(agentId).call();
        ownersListPromises.push(result);
      }

      Promise.all(ownersListPromises).then(async (ownersList) => {
        const uniqueOwners = uniq(ownersList);
        const allAgentsPromises = [];
        for (let i = 0; i < uniqueOwners.length; i += 1) {
          const compInfo = getAgents(uniqueOwners[i]);
          allAgentsPromises.push(compInfo);
        }

        /**
           * filtering out if either one of request is failed
           */
        Promise.allSettled(allAgentsPromises).then((results) => {
          const allAgentsList = results
            .filter((result) => result.status === 'fulfilled')
            .map((item) => item.value);
          resolve(...allAgentsList);
        });
      });
    })
    .catch((e) => {
      console.error(e); /* eslint-disable-line no-console */
      reject(e);
    });
});
