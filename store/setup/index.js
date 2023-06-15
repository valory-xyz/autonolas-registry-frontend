import { apiTypes, syncTypes } from './_types';

const initialState = {
  account: null,
  balance: null,
  errorMessage: null,
  chainId: null,

  /**
   * boolean to indicate if the account was loaded
   */
  isLoaded: false,
};

const setup = (state = initialState, action) => {
  const { data } = action;

  switch (action.type) {
    case apiTypes.GET_API: {
      return { ...state, data };
    }

    case syncTypes.SET_LOADED:
    case syncTypes.SET_ACCOUNT:
    case syncTypes.SET_BALANCE:
    case syncTypes.SET_LOGIN_ERROR:
    case syncTypes.SET_CHAIND_ID:
    case syncTypes.SET_STORE_STATE: {
      return { ...state, ...action.data };
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
