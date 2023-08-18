import React, { useState, useEffect } from 'react';
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
import fs from "fs";
var assert = require('assert');

describe('Test Chains', () => {
  it('Check contract addresses and ABIs', async () => {
    // Try to do fetch. For now, the file is in local configuration.json
    //const registriesRepo = 'https://github.com/valory-xyz/autonolas-registries/blob/main/';
    //const response = await fetch(registriesRepo + 'docs/configuration.json');
    //const data = await response.json();

    const localArtifacts = [
      COMPONENT_REGISTRY_CONTRACT,
      AGENT_REGISTRY_CONTRACT,
      REGISTRIES_MANAGER_CONTRACT,
      SERVICE_REGISTRY_CONTRACT,
      SERVICE_REGISTRY_TOKEN_UTILITY_CONTRACT,
      SERVICE_REGISTRY_L2,
      SERVICE_MANAGER_CONTRACT,
      SERVICE_MANAGER_TOKEN_CONTRACT,
      OPERATOR_WHITELIST_CONTRACT
    ];

    const curDir = 'tests/test-chains/'
    const configName = curDir + 'configuration.json';
    const dataFromJSON = fs.readFileSync(configName, 'utf8');
    const parsedConfig = JSON.parse(dataFromJSON);

    // Loop over chains
    const numChains = parsedConfig.length
    for (let i = 0; i < numChains; i++) {
      const contracts = parsedConfig[i]["contracts"];
      // Traverse all tup-to-date configuration contracts
      for (let j = 0; j < contracts.length; j++) {
        // Go over local artifacts
        for (let k = 0; k < localArtifacts.length; k++) {
          // Take the configuration and local contract names that match
          if (contracts[j]["name"] === localArtifacts[k].contractName) {
            // Get local and configuration ABIs, stringify them
            const localABI = JSON.stringify(localArtifacts[k].abi);
            // TODO: update with fetching the URL
            // Get up-to-date remote contract artifact and its ABI
            const remoteJSON = fs.readFileSync(curDir + contracts[j]["artifact"], 'utf8');
            const remoteArtifact = JSON.parse(remoteJSON);
            // Stringify the remote ABI and compare with the local one
            const remoteABI = JSON.stringify(remoteArtifact["abi"]);
            assert(localABI === remoteABI);

            // Check the address
            const lowLetter = localArtifacts[k].contractName.charAt(0).toLowerCase() + localArtifacts[k].contractName.slice(1);
            // Need to stringify and then convert to JSON again to access the address field
            const addressStruct = JSON.stringify(ADDRESSES[parsedConfig[i]["chainId"]]);
            const addressStructJSON = JSON.parse(addressStruct);
            const localAddress = addressStructJSON[lowLetter];
            assert(localAddress === contracts[j]["address"]);
          }
        }
      }
    }
  });
});