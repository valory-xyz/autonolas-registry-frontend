import React from 'react';
import { useRouter } from 'next/router';
import {
  render, fireEvent, screen, waitFor,
} from '@testing-library/react';
import Login from 'components/Login';
import { CONSTANTS } from 'util/constants';
import { wrapProvider, dummyAddress, storeToUpdate } from '../../helpers';

const PATHNAME = 'agents';

// mock router
jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const push = jest.fn();

useRouter.mockImplementation(() => ({ push, pathname: PATHNAME }));

// Without making a copy, you will have a circular dependency problem
// const originalWindow = { ...window };
// const windowSpy = jest.spyOn(global, 'window', 'get');

// windowSpy.mockImplementation(() => ({
//   ...originalWindow,
//   ethereum: 'das',
// // ethereum: {
// //   request: jest.fn((e) => {
// //     // console.log(e);
// //     // Promise.resolve(1000);
// //   }),
// // },
// }));

// Object.defineProperty(global, 'window', {
//   ethereum: 'das',
//   // value: {
//   //   dataLayer: {
//   //     push: jest.fn(),
//   //   },
//   // },
// });

describe('<Login /> index.jsx', () => {
  // const windowCopy = global.window.location;

  // jest.spyOn(window, 'ethereum').mockImplementation().mockImplementation(() => true);
  const ethereumCopy = {
    isMetaMask: true,
    on: jest.fn(),
    request: jest.fn(({ method }) => {
      if (method === CONSTANTS.ETH_REQUESTACCOUNTS) {
        return Promise.resolve([dummyAddress]);
      }
      if (method === CONSTANTS.ETH_GETBALANCE) {
        return Promise.resolve('0x21e19db22a20da47216');
      }
      return Promise.resolve([]);
    }),

  };

  Object.defineProperty(window, 'ethereum', {
    configurable: true,
    enumerable: true,
    value: ethereumCopy,
    writable: true,
  });

  // // eslint-disable-next-line jest/no-hooks
  // beforeEach(() => {
  //   global.window = { ...global.window, ethereum: { isMetaMask: true } };
  // });

  // // eslint-disable-next-line jest/no-hooks
  // afterEach(() => {
  //   global.window = windowCopy;
  // });

  it('before login', async () => {
    expect.hasAssertions();


    const { container, getByText } = render(wrapProvider(<Login />, true));
    const connectBtn = container.querySelector('.ant-btn-primary');
    expect(connectBtn).toBeInTheDocument();
    // screen.debug();

    // click connect button
    fireEvent.click(connectBtn);

    await waitFor(async () => {
      // expect(connectBtn).not.toBeInTheDocument();
      storeToUpdate.dispatch({ type: 'ANY_ACTION' });

      // will be called twice (1. accountsChanged & 2. chainChanged)
      expect(ethereumCopy.on).toHaveBeenCalledTimes(2);

      // screen.debug();
    });
  });

  // it('after login', async () => {
  //   expect.hasAssertions();
  //   const { getByTestId } = render(wrapProvider(<Login />));
  //   const address = getByTestId('metamask-address').textContent;
  //   await waitFor(async () => {
  //     expect(address).toContain(dummyAddress);
  //   });
  // });
});
