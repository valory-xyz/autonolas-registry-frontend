import { getFirstAndLastIndex } from 'common-util/functions';

export const filterByOwner = (account, results = []) => results.filter(
  (e) => (e.owner || '').toLowerCase() === (account || '').toLowerCase(),
);

/**
 * get all the list and filter by owner
 */
export const getListByAccount = async ({
  account, total, getUnit, getOwner,
}) => new Promise((resolve, reject) => {
  try {
    const allListPromise = [];
    for (let i = 1; i <= total; i += 1) {
      const id = `${i}`;
      const result = getUnit(id).call();
      allListPromise.push(result);
    }

    Promise.all(allListPromise).then(async (componentsList) => {
      const results = await Promise.all(
        componentsList.map(async (info, i) => {
          const owner = await getOwner(`${i + 1}`);
          return { ...info, owner };
        }),
      );

      resolve(filterByOwner(account, results));
    });
  } catch (e) {
    console.error(e);
    reject(e);
  }
});

/**
 * call API once and return based on pagination
 */
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
