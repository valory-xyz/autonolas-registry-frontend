import { syncTypes } from './_types';

const initialState = {
  agentInstancesAndOperators: [],
};

const serviceState = (state = initialState, { type, data } = {}) => {
  switch (type) {
    case syncTypes.SET_AGENT_INSTANCES_AND_OPERATORS:
    case syncTypes.SET_STORE_STATE: {
      return { ...state, ...data };
    }

    default:
      return state;
  }
};

export default serviceState;
