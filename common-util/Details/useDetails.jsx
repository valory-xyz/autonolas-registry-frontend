import {
  useState, useEffect, useCallback, useMemo,
} from 'react';
import {
  notifyError,
  NA,
  areAddressesEqual,
} from '@autonolas/frontend-library';

import { useHelpers } from '../hooks';
import { useSvmConnectivity } from '../hooks/useSvmConnectivity';

export const useDetails = ({
  id, type, getDetails, getOwner, getTokenUri,
}) => {
  const { account, chainId, isSvm } = useHelpers();
  const { walletPublicKey } = useSvmConnectivity();

  const [isLoading, setIsLoading] = useState(true);
  const [info, setInfo] = useState({});
  const [ownerAddress, setDetailsOwner] = useState(NA);
  const [tokenUri, setTokenUri] = useState(null);

  // fetch details such as service details, owner of agent/component/service,
  // token uri
  useEffect(() => {
    const getData = async () => {
      console.log('~~~~~ useDetails - getData called');

      setIsLoading(true);
      setInfo([]);

      try {
        const tempDetails = await getDetails(id);
        setInfo(tempDetails);

        const ownerAccount = await getOwner(id);
        setDetailsOwner(ownerAccount || '');

        const tempTokenUri = await getTokenUri(id);
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

  /**
   * function to update details (ie, service info)
   */
  const updateDetails = useCallback(async () => {
    try {
      const details = await getDetails(id);
      setInfo(details);
    } catch (e) {
      console.error(e);
      notifyError(`Error fetching ${type} details`);
    }
  }, [id, type, getDetails]);

  const isOwner = useMemo(() => {
    if (isSvm) {
      if (walletPublicKey && ownerAddress) {
        return areAddressesEqual(walletPublicKey, ownerAddress);
      }
      return false;
    }

    if (account && ownerAddress) {
      return areAddressesEqual(account, ownerAddress);
    }

    return false;
  }, [account, ownerAddress, isSvm, walletPublicKey]);

  return {
    isLoading,
    info,
    ownerAddress,
    tokenUri,
    isOwner,
    updateDetails,
  };
};
