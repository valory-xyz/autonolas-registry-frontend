import compact from 'lodash/compact';

export const getNumberOfAgentAddress = (agentAddresses) => {
  /**
   * get the number of addresses
   * g1. ['0x123', '0x456'] => 2
   * eg2. ['0x123', '0x456', ''] => 2 // empty string (falsy) is ignored
   */
  const addressCount = compact((agentAddresses || '').split(',')).length;
  return addressCount;
};

/**
 * FOR AGENT ID
 * 1. get the bond value
 * 2. get the number of input addresses
 * 3. multiply the number of past addresses with the bond value
 *
 * @example
 * input: [agentId1 => 2 address, agentId2 => 3 address]
 * bonds: [100, 200]
 * output: 2 * 100 + 3 * 200 = 800
 */
export const transformSlotsAndBonds = (
  slotsArray,
  bondsArray,
  tableDataSource,
) => {
  let totalBonds = 0;
  (tableDataSource || []).forEach((data) => {
    const { agentAddresses, bond } = data;

    /**
     * get the number of addresses
     * g1. ['0x123', '0x456'] => 2
     * eg2. ['0x123', '0x456', ''] => 2 // empty string (falsy) is ignored
     */
    const numberOfAgentAddress = getNumberOfAgentAddress(agentAddresses);

    // multiply the number of addresses with the bond value of the agentId
    totalBonds += numberOfAgentAddress * bond;
  });

  return { slots: slotsArray, bonds: bondsArray, totalBonds };
};

export const transformDatasourceForServiceTable = ({
  agentIds,
  numAgentInstances,
  slots,
  bonds,
}) => {
  const dateSource = agentIds.map((aid, i) => ({
    key: aid,
    agentId: aid,
    availableSlots: Number(slots[i]) - Number(numAgentInstances[i]),
    totalSlots: slots[i],
    bond: bonds[i],
    agentAddresses: null,
  }));

  return dateSource;
};
