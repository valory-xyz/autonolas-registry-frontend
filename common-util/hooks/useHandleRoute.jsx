import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { toLower } from 'lodash';

import { useHelpers } from 'common-util/hooks';
import { SUPPORTED_CHAINS_MORE_INFO } from 'common-util/Login/config';
import { doesPathIncludesComponentsOrAgents } from 'common-util/functions';

export const PAGES_TO_LOAD_WITHOUT_CHAINID = [
  '/disclaimer',
  '/page-not-found',
  '/not-legal',
];

const isValidNetworkName = (name) => {
  if (name === 'ethereum') return true;
  return SUPPORTED_CHAINS_MORE_INFO.some(
    (e) => toLower(e.networkName) === toLower(name),
  );
};

const isValidL1NetworkName = (name) => {
  if (name === 'ethereum') return true;
  if (name === 'goerli') return true;
  return false;
};

/**
 * handles the route
 */
export const useHandleRoute = () => {
  const router = useRouter();
  const { isL1Network } = useHelpers();
  const path = router?.pathname || '';
  const networkNameFromUrl = router?.query?.network;

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
      router.push('/page-not-found');
      return;
    }

    /**
     * homepage
     * - if user navigates to `/ethereum` then no need to redirect
     * - if user navigates to `/` then redirect to `/ethereum` page
     * - if user navigates to `/random-page` then redirect to `/page-not-found`
     */

    // eg. /ethereum/components => ['ethereum', 'components']
    const pathArray = (path?.split('/') || []).filter(Boolean);

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

    // eg. [networkName, components/agents/services]
    const isNonHomepage = pathArray === 2;
    if (isNonHomepage && !isValidNetworkName(networkNameFromUrl)) {
      /**
       * eg.
       * - /random-page => /page-not-found
       * - /ethereumTypo => /page-not-found
       */
      router.push('/page-not-found');
      return;
    }

    // components, agents
    /**
     * if user navigates to `/ethereum/components` or `/ethereum/agents` then no need to redirect
     * if user navigates to `/goerli/components` or `/goerli/agents` then no need to redirect
     *
     * if user navigates to `/ethereum/random-page redirect to `/page-not-found`
     *
     * if user navigates to `/gnosis/components redirect to `/goerli/page-not-found` because
     * components & agents are not supported on gnosis
     */

    if (
      !isValidL1NetworkName(networkNameFromUrl)
      && doesPathIncludesComponentsOrAgents(path)
    ) {
      router.push(`/${networkNameFromUrl}/services`);
    }
  }, [path, networkNameFromUrl]);

  const onHomeClick = () => {
    if (networkNameFromUrl) {
      router.push(
        `/${networkNameFromUrl}/${isL1Network ? 'components' : 'services'}`,
      );
    } else {
      router.push('/ethereum/components');
    }
  };

  return { onHomeClick };
};
