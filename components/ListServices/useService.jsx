/**
 * hooks to get service information - contract read & write functions
 */

import { useCallback } from 'react';
import { useHelpers } from 'common-util/hooks';
import { notifyError } from '@autonolas/frontend-library';

import {
  getServiceDetails,
  // getServiceOwner,
  // getTokenUri as getEvmTokenUri,
} from './utils';
import {
  useGetSvmServiceDetails,
  // useServiceOwner,
  // useTokenUri,
} from './useSvmService';

/**
 * hooks to get service details
 * @returns {function} - function to get service details
 */
export const useGetServiceDetails = () => {
  const { isSvm } = useHelpers();
  const { getSvmServiceDetails } = useGetSvmServiceDetails();

  return useCallback(
    async (id) => {
      if (!id) {
        notifyError('No service id provided');
      }

      const e = isSvm
        ? await getSvmServiceDetails(id)
        : await getServiceDetails(id);
      return e;
    },
    [isSvm, getSvmServiceDetails],
  );
};
