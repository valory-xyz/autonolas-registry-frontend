import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { toLower } from 'lodash';

import { useHelpers } from 'common-util/hooks';
import { SUPPORTED_CHAINS_MORE_INFO } from 'common-util/Login/config';

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

const doesItIncludesComponentsAndAgents = (path) => {
  console.log(path);
  if (!path) return false;
  return path.includes('components') || path.includes('agents');
};

/**
 * handles the route
 */
export const useHandleRoute = () => {
  const router = useRouter();
  const { chainId, chainName, isL1Network } = useHelpers();
  const path = router?.pathname || '';
  const networkNameFromUrl = router?.query?.network;

  console.log({ chainId, isL1Network });

  useEffect(() => {
    console.log({ path, networkNameFromUrl });

    if (PAGES_TO_LOAD_WITHOUT_CHAINID.includes(path)) {
      return;
    }

    /**
     * if user navigates to `/` (homepage) then
     * redirect to `/ethereum` page
     */
    if (path === '/') {
      router.push('/ethereum');
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

    const isHomepage = path?.split('/')?.length === 2;

    // console.log({ len: path?.split('/')?.length, isHomepage });

    if (isHomepage) {
      if (!isValidNetworkName(networkNameFromUrl)) {
        /**
         * eg.
         * - /random-page => /page-not-found
         * - /ethereumTypo => /page-not-found
         */
        router.push('/page-not-found');
      }
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

    console.log('here-1', {
      networkNameFromUrl,
      isValidL1NetworkName: isValidL1NetworkName(networkNameFromUrl),
      doesItIncludesComponentsAndAgents: doesItIncludesComponentsAndAgents(path),
    });

    if (
      !isValidL1NetworkName(networkNameFromUrl)
      && doesItIncludesComponentsAndAgents(path)
    ) {
      console.log('here-2');
      router.push(`/${networkNameFromUrl}/services`);
    }

    // router.push('/page-not-found');
  }, [path, networkNameFromUrl]);

  const onHomeClick = () => {
    if (networkNameFromUrl) {
      router.push(`/${networkNameFromUrl}`);
    } else {
      router.push('/ethereum');
    }
  };

  return { onHomeClick };
};
