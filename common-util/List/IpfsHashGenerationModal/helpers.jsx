/* eslint-disable import/no-unresolved */
/* eslint-disable no-restricted-syntax */

import { create } from 'ipfs-http-client';
import { base16 } from 'multiformats/bases/base16';
import { HASH_PREFIX } from 'util/constants';

const ipfs = create({
  host: process.env.NEXT_PUBLIC_REGISTRY_URL,
  port: 443,
  protocol: 'https',
});

export const getIpfsHashHelper = async (info) => {
  const updatedInfo = {
    ...info,
    uri: `ipfs://${HASH_PREFIX}${info.uri}`,
  };

  console.log({ updatedInfo });

  const otherOptions = {
    wrapWithDirectory: false, // default: false
  };

  const response = await ipfs.add(
    { path: 'metadata.json', content: JSON.stringify(updatedInfo) },
    otherOptions,
  );

  console.log({ response });

  const hash = response.cid.toV1().toString(base16.encoder);
  const updatedHash = hash.replace(HASH_PREFIX, '');

  console.log({ hash, updatedHash });
  return updatedHash;
};
