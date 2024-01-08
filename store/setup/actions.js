import { syncTypes } from './_types';

export const setUserAccount = (account) => ({
  type: syncTypes.SET_ACCOUNT,
  data: { account },
});

export const setUserBalance = (balance) => ({
  type: syncTypes.SET_BALANCE,
  data: { balance },
});

/**
 * chainId should be set only using Layout component
 */
export const setChainId = (chainId) => ({
  type: syncTypes.SET_CHAIND_ID,
  data: { chainId },
});

export const setBlockchainName = (blockchainName) => ({
  type: syncTypes.SET_BLOCKCHAIN_NAME,
  data: { blockchainName },
});

export const setLogout = () => ({
  type: syncTypes.SET_LOGOUT,
  data: null,
});

export const setErrorMessage = (errorMessage) => ({
  type: syncTypes.SET_LOGIN_ERROR,
  data: { errorMessage },
});
