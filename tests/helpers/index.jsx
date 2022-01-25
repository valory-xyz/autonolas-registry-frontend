import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();
export const dummyAddress = '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199';
export const emptyStore = mockStore({});

export const initStore = mockStore({
  setup: { account: dummyAddress },
});

export const storeToUpdate = mockStore((e) => {
  console.log(e);
  // if() {

  // }
  return {
    setup: { account: dummyAddress },
  };
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

export const dummyFunction = jest.fn(() => {});
