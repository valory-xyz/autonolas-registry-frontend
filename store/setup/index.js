import { apiTypes, syncTypes } from './_types';

const initialState = {
  account: null,
  balance: null,
  errorMessage: null,

  /**
   * boolean to indicate if the account was loaded
   */
  isLoaded: false,
};

export default (state = initialState, action) => {
  const { data } = action;

  switch (action.type) {
    case apiTypes.GET_API: {
      return { ...state, data };
    }

    case syncTypes.SET_LOADED: {
      return { ...state, ...action.data };
    }

    case syncTypes.SET_ACCOUNT: {
      return { ...state, ...action.data };
    }

    case syncTypes.SET_BALANCE: {
      return { ...state, ...action.data };
    }

    case syncTypes.SET_LOGIN_ERROR: {
      return { ...state, ...action.data };
    }

    case syncTypes.SET_STORE_STATE: {
      return { ...state, ...action.data };
    }

    default:
      return state;
  }
};
