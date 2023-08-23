/* eslint-disable jest/expect-expect */
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
import { ADDRESSES } from 'common-util/Contracts';
import fs from 'fs';

const assert = require('assert');

const fetch = require('node-fetch');

describe('test-chains/TestChains.jsx', () => {
  it(
    'check contract addresses and ABIs',
    async () => {
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

      // Registries repository
      const registriesRepo = 'https://raw.githubusercontent.com/valory-xyz/autonolas-registries/main/';
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
            // Take the configuration and local contract names that match
            if (contracts[j].name === localArtifacts[k].contractName) {
              // Get local and configuration ABIs, stringify them
              const localABI = JSON.stringify(localArtifacts[k].abi);
              // TODO: update with fetching the URL
              // Get up-to-date remote contract artifact and its ABI
              response = await fetch(registriesRepo + contracts[j].artifact);
              const remoteArtifact = await response.json();
              // Stringify the remote ABI and compare with the local one
              const remoteABI = JSON.stringify(remoteArtifact.abi);
              assert(localABI === remoteABI);

              // Check the address
              const lowLetter = localArtifacts[k].contractName.charAt(0).toLowerCase()
                + localArtifacts[k].contractName.slice(1);
              // Need to stringify and then convert to JSON again to access the address field
              const addressStruct = JSON.stringify(
                ADDRESSES[parsedConfig[i].chainId],
              );
              const addressStructJSON = JSON.parse(addressStruct);
              const localAddress = addressStructJSON[lowLetter];
              assert(localAddress === contracts[j].address);
            }
          }
        }
      }
    },
    2 * 60 * 1000,
  );
});