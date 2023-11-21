import { SUPPORTED_CHAINS_MORE_INFO } from 'common-util/Login/config';
import { apiTypes, syncTypes } from './_types';

const initialState = {
  account: null,
  balance: null,
  errorMessage: null,

  // chain info
  chainId: null,
  chainDisplayName: null,
  chainName: null,
};

const setup = (state = initialState, { data, type } = {}) => {
  switch (type) {
    case apiTypes.GET_API: {
      return { ...state, data };
    }

    case syncTypes.SET_ACCOUNT:
    case syncTypes.SET_BALANCE:
    case syncTypes.SET_LOGIN_ERROR:
    case syncTypes.SET_STORE_STATE: {
      return { ...state, ...data };
    }
    case syncTypes.SET_CHAIND_ID: {
      const networkInfo = SUPPORTED_CHAINS_MORE_INFO.find(
        (item) => item.id === data.chainId,
      );
      return {
        ...state,
        ...data,
        chainDisplayName: networkInfo?.networkDisplayName || null,
        chainName: networkInfo?.networkName || null,
      };
    }

    case syncTypes.SET_LOGOUT: {
      return {
        ...state,
        account: null,
        balance: null,
        errorMessage: null,
        isVerified: false,
      };
    }

    default:
      return state;
  }
};

export default setup;
