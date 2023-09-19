import { TOTAL_VIEW_COUNT } from 'util/constants';

/**
 * @example
 * TOTAL_VIEW_COUNT = 10
 * nextPage = 5
 * total = 45
 * first = ((5 - 1) * 10) + 1
 *      = (4 * 10) + 1
 *      = 41
 * last = min(5 * 10, 45)
 *      = 45
 */
export const getFirstAndLastIndex = (total, nextPage) => {
  const first = (nextPage - 1) * TOTAL_VIEW_COUNT + 1;
  const last = Math.min(nextPage * TOTAL_VIEW_COUNT, total);
  return { first, last };
};
