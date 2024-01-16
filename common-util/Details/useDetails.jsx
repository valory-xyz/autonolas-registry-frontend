import { useState, useEffect, useCallback } from 'react';
import { notifyError, NA } from '@autonolas/frontend-library';
import { useHelpers } from '../hooks';

export const useDetails = ({
  id, type, getDetails, getOwner, getTokenUri,
}) => {
  const { account, chainId } = useHelpers();

  const [isLoading, setIsLoading] = useState(true);
  const [info, setInfo] = useState({});
  const [ownerAddress, setDetailsOwner] = useState(NA);
  const [tokenUri, setTokenUri] = useState(null);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      setInfo([]);

      try {
        const temp = await getDetails();
        setInfo(temp);

        const ownerAccount = await getOwner();
        setDetailsOwner(ownerAccount || '');

        const tempTokenUri = await getTokenUri();
        setTokenUri(tempTokenUri);
      } catch (e) {
        console.error(e);
        notifyError(`Error fetching ${type} details`);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [account, chainId, id, type, getDetails, getOwner, getTokenUri]);

  const updateDetailsFn = useCallback(async () => {
    try {
      const details = await getDetails();
      setInfo(details);
    } catch (e) {
      console.error(e);
      notifyError(`Error fetching ${type} details`);
    }
  }, [type, getDetails]);

  const isOwner = account && account.toLowerCase() === ownerAddress.toLowerCase();

  return {
    isLoading,
    info,
    ownerAddress,
    tokenUri,
    updateDetailsFn,
    isOwner,
  };
};
