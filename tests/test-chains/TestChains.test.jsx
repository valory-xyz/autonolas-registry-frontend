/* eslint-disable jest/no-conditional-in-test */
/* eslint-disable no-await-in-loop */
import fetch from 'node-fetch';
import {
  COMPONENT_REGISTRY_CONTRACT,
  AGENT_REGISTRY_CONTRACT,
  REGISTRIES_MANAGER_CONTRACT,
  SERVICE_REGISTRY_CONTRACT,
  SERVICE_REGISTRY_TOKEN_UTILITY_CONTRACT,
  SERVICE_REGISTRY_L2,
  SERVICE_MANAGER_CONTRACT,
  SERVICE_MANAGER_TOKEN_CONTRACT,
  OPERATOR_WHITELIST_CONTRACT,
} from 'common-util/AbiAndAddresses';
import {
  ADDRESSES,
  multisigAddresses,
  multisigSameAddresses,
} from 'common-util/Contracts';

const localArtifacts = [
  COMPONENT_REGISTRY_CONTRACT,
  AGENT_REGISTRY_CONTRACT,
  REGISTRIES_MANAGER_CONTRACT,
  SERVICE_REGISTRY_CONTRACT,
  SERVICE_REGISTRY_TOKEN_UTILITY_CONTRACT,
  SERVICE_REGISTRY_L2,
  SERVICE_MANAGER_CONTRACT,
  SERVICE_MANAGER_TOKEN_CONTRACT,
  OPERATOR_WHITELIST_CONTRACT,
];
const registriesRepo = 'https://raw.githubusercontent.com/valory-xyz/autonolas-registries/main/';

describe('test-chains/TestChains.jsx', () => {
  it(
    'check contract addresses and ABIs',
    async () => {
      // Registries repository
      // Fetch the actual config
      let response = await fetch(`${registriesRepo}docs/configuration.json`);
      const parsedConfig = await response.json();

      // Loop over chains
      const numChains = parsedConfig.length;
      for (let i = 0; i < numChains; i += 1) {
        const { contracts } = parsedConfig[i];
        // Traverse all tup-to-date configuration contracts
        for (let j = 0; j < contracts.length; j += 1) {
          // Go over local artifacts
          for (let k = 0; k < localArtifacts.length; k += 1) {
            const { chainId } = parsedConfig[i];

            if (contracts[j].name === 'GnosisSafeMultisig') {
              // Check for the GnosisSafeMultisig address
              expect(contracts[j].address).toBe(multisigAddresses[chainId][0]);
            } else if (contracts[j].name === 'GnosisSafeSameAddressMultisig') {
              // Check for the GnosisSafeSameAddressMultisig address
              expect(contracts[j].address).toBe(
                multisigSameAddresses[chainId][0],
              );
            } else if (contracts[j].name === localArtifacts[k].contractName) {
              // Take the configuration and local contract names that match
              // Get local and configuration ABIs, stringify them
              const localABI = JSON.stringify(localArtifacts[k].abi);

              // Get up-to-date remote contract artifact and its ABI
              response = await fetch(registriesRepo + contracts[j].artifact);
              const remoteArtifact = await response.json();

              // Stringify the remote ABI and compare with the local one
              const remoteABI = JSON.stringify(remoteArtifact.abi);
              expect(localABI).toBe(remoteABI);

              // Check the address
              const lowLetter = localArtifacts[k].contractName.charAt(0).toLowerCase()
                + localArtifacts[k].contractName.slice(1);
              // Need to stringify and then convert to JSON again to access the address field
              const addressStruct = JSON.stringify(ADDRESSES[chainId]);
              const addressStructJSON = JSON.parse(addressStruct);
              const localAddress = addressStructJSON[lowLetter];
              expect(localAddress).toBe(contracts[j].address);
            }
          }
        }
      }
    },
    2 * 60 * 1000,
  );
});
