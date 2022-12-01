import { syncTypes } from './_types';

export const setAgentInstancesAndOperators = (data) => ({
  type: syncTypes.SET_AGENT_INSTANCES_AND_OPERATORS,
  data: { agentInstancesAndOperators: data },
});
