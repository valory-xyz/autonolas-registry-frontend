import { getFirstAndLastIndex } from 'common-util/functions';

export const getListByAccount = async ({
  account, total, getUnit, getOwner,
}) => new Promise((resolve, reject) => {
  try {
    const allComponentsPromises = [];
    for (let i = 1; i <= total; i += 1) {
      const componentId = `${i}`;
      const result = getUnit(componentId).call();
      allComponentsPromises.push(result);
    }

    Promise.all(allComponentsPromises).then(async (componentsList) => {
      const results = await Promise.all(
        componentsList.map(async (info, i) => {
          const owner = await getOwner(`${i + 1}`);
          return { ...info, owner };
        }),
      );

      const finalResult = results.filter(
        (e) => (e.owner || '').toLowerCase() === (account || '').toLowerCase(),
      );
      resolve(finalResult);
    });
  } catch (e) {
    console.error(e);
    reject(e);
  }
});

export const getMyListOnPagination = async ({
  total,
  nextPage,
  myList,
  getMyList,
}) => {
  let e = myList;
  if (myList.length === 0) {
    e = await getMyList();
  }

  const { first, last } = getFirstAndLastIndex(total, nextPage);
  const array = e.slice(first - 1, last);
  return new Promise((resolve) => resolve(array));
};
