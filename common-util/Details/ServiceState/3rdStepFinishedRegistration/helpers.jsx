/* eslint-disable consistent-return */
export const isHashApproved = (contract, startingBlock, op) => new Promise((resolve, reject) => {
  const interval = setInterval(async () => {
    window.console.log('Attempting to getPastEvents...');

    try {
      const pastEvents = await contract.getPastEvents('ApproveHash', {
        filter: op,
        fromBlock: startingBlock - 10,
        toBlock: 'latest',
      });
      window.console.log('pastEvents:', pastEvents);

      const hashApproved = pastEvents.length !== 0;
      if (hashApproved) {
        window.console.log('hashApproved');
        clearInterval(interval);
        return resolve();
      }
    } catch (error) {
      clearInterval(interval);
      return reject(error);
    }
  }, 5000);
});
