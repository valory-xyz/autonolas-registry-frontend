import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { toLower } from 'lodash';

import { setBlockchainInfo, setChainId } from 'store/setup/actions';
import { PAGES_TO_LOAD_WITHOUT_CHAINID, URL } from 'util/constants';
import { useHelpers } from 'common-util/hooks';
import {
  ETHEREUM_AND_SOLANA_SUPPORTED_CHAINS,
  ETHEREUM_SUPPORTED_CHAINS,
} from 'common-util/Login/config';
import {
  doesPathIncludesComponentsOrAgents,
  isPageWithSolana,
} from 'common-util/functions';

const isValidNetworkName = (name) => ETHEREUM_AND_SOLANA_SUPPORTED_CHAINS.some(
  (e) => toLower(e.networkName) === toLower(name),
);

const getChainIdFromPath = (networkName) => ETHEREUM_SUPPORTED_CHAINS.find(
  (e) => toLower(e.networkName) === toLower(networkName),
)?.id;

const isValidL1NetworkName = (name) => {
  if (name === 'ethereum') return true;
  if (name === 'goerli') return true;
  return false;
};

/**
 * Hook to handle the routing
 */
export const useHandleRoute = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isL1Network } = useHelpers();
  const path = router?.pathname || '';
  const networkNameFromUrl = router?.query?.network;

  const dispathWithDelay = (action) => {
    setTimeout(() => {
      dispatch(action);
    }, 0);
  };

  const updateChainId = (id) => {
    sessionStorage.setItem('chainId', id);
    dispathWithDelay(setChainId(id));
  };

  // updating the blockchain information in redux
  useEffect(() => {
    const isValidNetwork = isValidNetworkName(networkNameFromUrl);
    dispathWithDelay(setBlockchainInfo(networkNameFromUrl));

    if (!isPageWithSolana(networkNameFromUrl)) {
      const chainIdFromPath = getChainIdFromPath(networkNameFromUrl);
      updateChainId(isValidNetwork ? chainIdFromPath : 1);
    }
  }, [networkNameFromUrl]);

  useEffect(() => {
    if (PAGES_TO_LOAD_WITHOUT_CHAINID.includes(path)) {
      return;
    }

    /**
     * if user navigates to `/` (homepage) then
     * redirect to `/ethereum/components` page
     */
    if (path === '/') {
      router.push('/ethereum/components');
      return;
    }

    /**
     * if the network name is invalid, eg.
     * - user navigates to `/random-page` => redirect to `/page-not-found`
     * - user nagivates to `/random/components` => `/page-not-found`
     * -
     */
    if (!isValidNetworkName(networkNameFromUrl)) {
      router.push(URL.PAGE_NOT_FOUND);
      return;
    }

    // eg. /ethereum/components => ['ethereum', 'components']
    // eg 1. pathArray = [networkName, components/agents/services]
    // eg 2. pathArray = [networkName, agents, mint]
    const pathArray = (path?.split('/') || []).filter(Boolean);

    const listingPage = pathArray >= 2;
    if (listingPage && !isValidNetworkName(networkNameFromUrl)) {
      /**
       * eg.
       * - /random-page => /page-not-found
       * - /ethereummmmTypo => /page-not-found
       */
      router.push(URL.PAGE_NOT_FOUND);
      return;
    }

    /**
     * - if user navigates to `/ethereum/components` then no need to redirect
     * - if user navigates to `/` then redirect to `/ethereum/components` page
     * - if user navigates to `/ethereum` then redirect to `/ethereum/components` page
     * - if user navigates to `/random-page` then redirect to `/page-not-found`
     */

    // User navigates to `/[network]`
    if (
      !PAGES_TO_LOAD_WITHOUT_CHAINID.includes(router.asPath)
      && pathArray.length === 1
    ) {
      router.push(
        `/${networkNameFromUrl}/${isL1Network ? 'components' : 'services'}`,
      );
      return;
    }

    // ONLY components, agents
    /**
     * if user navigates to `/ethereum/components` or `/ethereum/agents` then no need to redirect
     * if user navigates to `/goerli/components` or `/goerli/agents` then no need to redirect
     *
     * if user navigates to `/ethereum/random-page redirect to `/page-not-found`
     *
     * if user navigates to `/gnosis/components redirect to `/gnosis/services`
     * because components & agents are not supported on gnosis
     */

    if (
      !isValidL1NetworkName(networkNameFromUrl)
      && doesPathIncludesComponentsOrAgents(path)
    ) {
      router.push(`/${networkNameFromUrl}/services`);
    }
  }, [path, networkNameFromUrl, isL1Network, router]);

  const onHomeClick = () => {
    if (networkNameFromUrl) {
      router.push(
        `/${networkNameFromUrl}/${isL1Network ? 'components' : 'services'}`,
      );
    } else {
      router.push('/ethereum/components');
    }
  };

  return { onHomeClick, updateChainId };
};
