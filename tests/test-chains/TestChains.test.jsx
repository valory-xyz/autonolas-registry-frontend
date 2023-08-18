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
import fs from "fs";

describe('Test Chains', () => {
  it('Check contract addresses and ABIs', async () => {
    const aaa = JSON.stringify(COMPONENT_REGISTRY_CONTRACT.abi);
//     //console.log(aaa);
//     const registriesRepo = 'https://github.com/valory-xyz/autonolas-registries/blob/main/';
//     const response = await fetch(registriesRepo + 'docs/configuration.json');
//     const data = await response.json();
//     console.log(data);

//   const [fileContent, setFileContent] = useState('');
//
//   useEffect(() => {
//     async function fetchFile() {
//       try {
//         const registriesRepo = 'https://github.com/valory-xyz/autonolas-registries/blob/main/';
//         const response = await fetch(registriesRepo + 'docs/configuration.json');
//         if (response.ok) {
//           const content = await response.json();
//           console.log(content);
//           setFileContent(content);
//         } else {
//           console.error('Failed to fetch file:', response.statusText);
//         }
//       } catch (error) {
//         console.error('Error fetching file:', error);
//       }
//     }
//
//     fetchFile();
//   }, []);



  });
});