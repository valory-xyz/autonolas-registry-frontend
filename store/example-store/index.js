import { apiTypes, syncTypes } from './_types';

const initialState = {};

export default (state = initialState, action) => {
  const { data } = action;

  switch (action.type) {
    case apiTypes.GET_API: {
      return {
        ...state,
        data,
      };
    }

    case syncTypes.SET_STORE_STATE: {
      return { ...state, ...action.data };
    }

    default:
      return state;
  }
};
