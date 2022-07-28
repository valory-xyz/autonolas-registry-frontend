/* eslint-disable import/no-unresolved */
/* eslint-disable no-restricted-syntax */
/**
 * 1. first we need to JSON data to the backend and get the initial hash =>
 * after uploading the file.
 * 2.  we should convert to base16 (version)
 */
import { create, CID } from 'ipfs-http-client';
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

  // const value = new CID.createV1(response.cid);
  window.console.log(response);


  const v1 = response.cid.toV0().toString();
  window.console.log(response.cid.toString());
  window.console.log(response.cid.toV0().toString());
  window.console.log(v1);
  // window.console.log(response.);
  const cid = new CID(v1);
  window.console.log(cid);

  // const hash = response.cid.toV1().toString();
  return v1;
};

export const readDataFromIpfs = async (hash) => {
  const asynItr = ipfs.cat(hash);

  for await (const itr of asynItr) {
    const data = Buffer.from(itr).toString();
    window.console.log(data);
  }
};
