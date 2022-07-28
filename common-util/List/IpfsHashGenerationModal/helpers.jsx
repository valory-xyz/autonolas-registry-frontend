/* eslint-disable import/no-unresolved */
/* eslint-disable no-restricted-syntax */

import { create } from 'ipfs-http-client';
import { base16 } from 'multiformats/bases/base16';
import { HASH_PREFIX, GATEWAY_URL } from 'util/constants';

const ipfs = create({
  host: 'registry.autonolas.tech',
  port: 443,
  protocol: 'https',
});

export const getIpfsHashHelper = async (info) => {
  const updatedInfo = {
    ...info,
    uri: `${GATEWAY_URL}${HASH_PREFIX}${info.uri}`,
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

  const hash = response.cid.toV1().toString(base16.encoder);
  const updatedHash = hash.replace(HASH_PREFIX, '');
  return updatedHash;
};

export const readDataFromIpfs = async (hash) => {
  const asynItr = ipfs.cat(hash);

  for await (const itr of asynItr) {
    const data = Buffer.from(itr).toString();
    window.console.log(data);
  }
};
