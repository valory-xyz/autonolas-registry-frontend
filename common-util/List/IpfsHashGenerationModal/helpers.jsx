/* eslint-disable import/no-unresolved */
/* eslint-disable no-restricted-syntax */
/**
 * 1. first we need to JSON data to the backend and get the initial hash =>
 * after uploading the file.
 * 2.  we should convert to base16 (version)
 */
import { HASH_PREFIX } from 'util/constants';

import { create } from 'ipfs-http-client';

// const OPEN_AEA_IPFS_ADDR = '/dns/registry.autonolas.tech/tcp/443/https';

// const client = create({ url: new URL(OPEN_AEA_IPFS_ADDR) });
// const client = create({
//   url: 'https://gateway.autonolas.tech/ipfs/bafybeibh3iu7kojc4d5eiigqh6kx2vdmu2q7vhcvvq2rz6suegsscyd66y',
// });
// const client = create({ host: 'https://registry.autonolas.tech/', port: '443', protocol: 'https' });
// const client = create('/dns/registry.autonolas.tech/tcp/443/https');

const ipfs = create({
  host: 'registry.staging.autonolas.tech',
  port: 443,
  protocol: 'https',
});

export const getIpfsHash = async (info) => {
  const updatedInfo = {
    ...info,
    uri: `https://gateway.autonolas.tech/ipfs/${HASH_PREFIX}${info.uri}`,
  };

  window.console.log(updatedInfo);

  const otherOptions = {
    wrapWithDirectory: false, // default: false
  };

  const response = await ipfs.add(
    {
      path: 'metadata.json',
      content: JSON.stringify(updatedInfo),
    },
    otherOptions,
  );

  window.console.log(response);

  return response;
};

export const readDataFromIpfs = async (hash) => {
  const asynItr = ipfs.cat(hash);

  for await (const itr of asynItr) {
    const data = Buffer.from(itr).toString();
    window.console.log(data);
  }
};
