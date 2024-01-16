import { useState, useEffect, useMemo } from 'react';
import { get } from 'lodash';
import { notifyError, NA } from '@autonolas/frontend-library';

import { GATEWAY_URL, HASH_DETAILS_STATE } from 'util/constants';

const pattern = /https:\/\/localhost\/(agent|component|service)\/+/g;
const getAutonolasTokenUri = (tokenUri) => (tokenUri || '').replace(pattern, GATEWAY_URL);

/**
 * NFT details: hook to fetch metadata from IPFS
 * @param {string} tokenUri
 */
export const useMetadata = (tokenUri) => {
  const [metadata, setMetadata] = useState(null);
  const [metadataLoadState, setMetadataState] = useState(
    HASH_DETAILS_STATE.IS_LOADING,
  );

  // fetch metadata from IPFS
  useEffect(() => {
    const getMetadata = async () => {
      setMetadataState(HASH_DETAILS_STATE.IS_LOADING);
      try {
        const ipfsUrl = getAutonolasTokenUri(tokenUri);
        const response = await fetch(ipfsUrl);
        const json = await response.json();
        setMetadata(json);
        setMetadataState(HASH_DETAILS_STATE.LOADED);
      } catch (e) {
        setMetadataState(HASH_DETAILS_STATE.FAILED);
        console.error(e);
        notifyError('Error fetching metadata from IPFS');
      }
    };

    if (tokenUri) getMetadata();
  }, [tokenUri]);

  const hashUrl = useMemo(() => getAutonolasTokenUri(tokenUri), [tokenUri]);

  const nftImageUrl = useMemo(() => {
    const image = get(metadata, 'image');
    if (!image) return null;
    return image.replace('ipfs://', GATEWAY_URL);
  }, [metadata]);

  const codeHref = useMemo(() => {
    const codeUri = get(metadata, 'code_uri');
    if (!codeUri) return null;
    return codeUri.replace('ipfs://', GATEWAY_URL);
  }, [metadata]);

  return {
    metadata,
    metadataLoadState,
    hashUrl,
    nftImageUrl,
    codeHref,
    description: get(metadata, 'description') || NA,
    version: get(metadata, 'attributes[0].value') || NA,
  };
};
