import { getFirstAndLastIndex } from 'common-util/functions';
import includes from 'lodash/includes';

export const filterByOwner = (results, { searchValue, account }) => (results || []).filter((e) => {
  const search = (searchValue || '').trim().toLowerCase();
  const ownerL = (e.owner || '').trim().toLowerCase();
  const hashL = (e.unitHash || '').trim().toLowerCase();

  // for "my components/agents" search only by Account
  if (account) {
    return ownerL === account.trim().toLowerCase() && includes(hashL, search);
  }

  return includes(ownerL, search) || includes(hashL, search);
});

/**
 * get all the list and filter by owner
 */
export const getListByAccount = async ({
  searchValue,
  total,
  getUnit,
  getOwner,
  account,
}) => new Promise((resolve, reject) => {
  try {
    const allListPromise = [];
    for (let i = 1; i <= total; i += 1) {
      const id = `${i}`;
      const result = getUnit(id);
      allListPromise.push(result);
    }

    Promise.all(allListPromise).then(async (componentsList) => {
      const results = await Promise.all(
        componentsList.map(async (info, i) => {
          const id = `${i + 1}`;
          const owner = await getOwner(id);
          return { ...info, id, owner };
        }),
      );

      const filteredResults = filterByOwner(results, {
        searchValue,
        account,
      });
      resolve(filteredResults);
    });
  } catch (e) {
    console.error(e);
    reject(e);
  }
});

/**
 * call API once and return based on pagination
 */
export const getMyListOnPagination = ({ total, nextPage, list = [] }) => {
  const { first, last } = getFirstAndLastIndex(total, nextPage);
  const array = list.slice(first - 1, last);
  return array;
};

/**
 * call API once and return based on pagination
 */
export const getTotalOfFilteredList = async ({ list }) => {
  const { length } = list || [];
  return length;
};
