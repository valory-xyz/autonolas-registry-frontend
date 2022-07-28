/* eslint-disable no-restricted-syntax */
/**
 * 1. first we need to JSON data to the backend and get the initial hash =>
 * after uploading the file.
 * 2.  we should convert to base16 (version)
 */
// import { HASH_PREFIX } from 'util/constants';

import { create } from 'ipfs-http-client';
// import { create, globSource } from 'ipfs';
// const { create } = require('ipfs-http-client');
// import IPFS from 'ipfs-core';
// import JSON from '../../../hello.json';

// const OPEN_AEA_IPFS_ADDR = '/dns/registry.autonolas.tech/tcp/443/https';

// const client = create({ url: new URL(OPEN_AEA_IPFS_ADDR) });
// const client = create({
//   url: 'https://gateway.autonolas.tech/ipfs/bafybeibh3iu7kojc4d5eiigqh6kx2vdmu2q7vhcvvq2rz6suegsscyd66y',
// });
// const client = create({ host: 'https://registry.autonolas.tech/', port: '443', protocol: 'https' });
// const client = create('/dns/registry.autonolas.tech/tcp/443/https');
// const client = create(new URL('/ip4/127.0.0.1/tcp/5001'));
// const client = create('http://127.0.0.1:8080');

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
});

export const getIpfsHash = async (info) => {
  // console.log({ create });
  // const updatedInfo = {
  //   ...info,
  //   uri: `https://gateway.autonolas.tech/ipfs/${HASH_PREFIX}${info.uri}`,
  // };
  // console.log({ updatedInfo });
  // // const response = await client.add(updatedInfo);
  // const response = await client.add('../../../hello.json');

  // const response = await ipfs.add('Hello world!');

  // const ipfs = await IPFS.create();
  // const response = await ipfs.add('../../../hello.json');

  const otherOptions = {
    wrapWithDirectory: false, // default: false
  };

  const response = await ipfs.add(
    {
      path: 'metadata.json',
      content: JSON.stringify(info),
    },
    otherOptions,
  );
  console.log(response);
};

export const readDataFromIpfs = async (hash) => {
  const asynItr = ipfs.cat(hash);

  for await (const itr of asynItr) {
    const data = Buffer.from(itr).toString();
    console.log(data);
  }
};

// getData("QmQbA7BrBNkh1bbSgtUYdUJYsHRfvRN6k5vocxHgjadUjr")
