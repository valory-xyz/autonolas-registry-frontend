/* eslint-disable import/no-unresolved */
/* eslint-disable no-restricted-syntax */
/**
 * 1. first we need to JSON data to the backend and get the initial hash =>
 * after uploading the file.
 * 2.  we should convert to base16 (version)
 */
import { create } from 'ipfs-http-client';
import isNil from 'lodash/isNil';
import { HASH_PREFIX } from 'util/constants';

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

export const getBase16Validator = (value) => {
  if (isNil(value) || value === '') {
    return Promise.resolve();
  }

  /**
   * only 64 characters long valid Hash
   */
  if (/[0-9A-Fa-f]{64}/gm.test(value)) {
    return Promise.resolve();
  }
  if (value.length === 64) return Promise.resolve();
  return Promise.reject(new Error('Please input a valid hash'));
};
