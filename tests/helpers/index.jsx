import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

// CONSTANTS
export const ACTIVE_TAB = '.ant-tabs-tab-active > div';
export const HEADER = '.ant-typography';

const mockStore = configureMockStore();
export const dummyAddress = '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199';
export const dummyHash = 'QmYuLhvusXYh2Pw5BqntNi9ZGg4Chcf1dhiuzxZesJCnK1';
export const emptyStore = mockStore({});

export const initStore = mockStore({
  setup: { account: dummyAddress },
});

/**
 *
 * @param {Component} component valid react component
 * @param {Boolean} isEmptyStore should the store need to be empty?
 * @returns
 */
export const wrapProvider = (component, isEmptyStore = false) => (
  <Provider store={isEmptyStore ? emptyStore : initStore}>{component}</Provider>
);

export const errorStore = mockStore({
  setup: { account: dummyAddress, errorMessage: 'Error in store' },
});

export const wrapProviderError = (component) => (
  <Provider store={errorStore}>{component}</Provider>
);

export const getTableTd = (i) => `.ant-table-tbody > tr.ant-table-row.ant-table-row-level-0 > td:nth-child(${i})`;

export const mockV1Hash = '6f3212908f2e7a0249b67b05f237a40b76b7d8ef36d5620b281ceb47dcb6b122';

export const mockNftImageHash = '9cf4ae0b5d082843b3b34d0d400abbeffcb5a98b68ea89f3abf151f182315ab0';

export const mockCodeUri = 'f017012209cf4ae0b5d082843b3b34d0d400abbeffcb5a98b68ea89f3abf151f182315ab0';
