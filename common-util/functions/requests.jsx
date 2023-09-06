import { ethers } from 'ethers';
import { DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS } from 'util/constants';
import {
  getServiceOwnerMultisigContract,
  getMyProvider,
} from 'common-util/Contracts';
import { checkIfGnosisSafe, notifyError } from './index';

const FALLBACK_HANDLER_STORAGE_SLOT = '0x6c9a6c4a39284e37ed1cf53d337577d14212a4870fb976a4366c693b939918d5';

/**
 * function to check the owner address can mint.
 * BE code: https://github.com/valory-xyz/autonolas-registries/pull/54#discussion_r1031510182
 * @returns {Promise<boolean>} true if the owner address can mint
 */
export const checkIfERC721Receive = async (account, ownerAddress) => {
  const provider = new ethers.providers.Web3Provider(getMyProvider(), 'any');
  const isSafe = await checkIfGnosisSafe(account, provider);

  if (isSafe) {
    try {
      const contract = getServiceOwnerMultisigContract(account);
      const threshold = await contract.methods.getThreshold().call();
      const owners = await contract.methods.getOwners().call();

      if (Number(threshold) > 0 && owners.length > 0) {
        const contents = await provider.getStorageAt(
          account,
          FALLBACK_HANDLER_STORAGE_SLOT,
        );

        const isInvalidContent = !contents
          || contents.slice(26)
            === DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS.slice(2);

        if (isInvalidContent) {
          notifyError(
            `Unable to mint to ${ownerAddress} due to the absense of a fallback handler.`,
          );
          return false;
        }
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  return true;
};
