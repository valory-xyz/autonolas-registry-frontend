import React from 'react';
import { useRouter } from 'next/router';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CONSTANTS } from 'util/constants';
import Login from 'components/Login';
import { getTrimmedText } from 'common-util/List/ListTable/helpers';
import { wrapProvider, wrapProviderError, dummyAddress } from '../../helpers';

const PATHNAME = 'agents';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));
const push = jest.fn();

jest.mock('@web3-react/core', () => ({
  __esModule: true,
  useWeb3React: jest.fn(() => ({
    library: {
      eth: { net: { getId: jest.fn(() => Promise.resolve(31337)) } },
    },
  })),
}));

useRouter.mockImplementation(() => ({ push, pathname: PATHNAME }));

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('login/index.jsx', () => {
  it('should render error when no metamask extension is available', async () => {
    expect.hasAssertions();
    delete window.ethereum; // delete previously set window mock.

    const ethereumCopy = {
      isMetaMask: false,
      on: jest.fn(),
    };

    Object.defineProperty(window, 'ethereum', {
      value: ethereumCopy,
      configurable: true,
    });

    const { getByText } = render(wrapProviderError(<Login />, true));
    expect(getByText(/Error in store/i)).toBeInTheDocument();
  });

  // TODO: fix and re-write for wallet-connect
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should call ethereum functions `on` & `request` twice on successful login', async () => {
    expect.hasAssertions();
    delete window.ethereum; // delete previously set window mock.

    const ethereumCopy = {
      isMetaMask: true,
      on: jest.fn((_a, b) => b(dummyAddress)),
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

    // TODO fix `Not implemented: navigation (except hash changes)` error
    // caused by window object mock
    Object.defineProperty(window, 'ethereum', {
      ...window,
      configurable: true,
      value: ethereumCopy,
    });

    const { container } = render(wrapProvider(<Login />, true));
    const connectBtn = container.querySelector('.ant-btn-primary');
    expect(connectBtn).toBeInTheDocument();

    // click connect button & expect mock function to be called
    userEvent.click(connectBtn);

    await waitFor(async () => {
      // will be called twice (1. accountsChanged & 2. chainChanged)
      expect(ethereumCopy.on).toHaveBeenCalledTimes(2);

      // will be called twice (1. ETH_REQUESTACCOUNTS & 2. ETH_GETBALANCE)
      expect(ethereumCopy.request).toHaveBeenCalledTimes(2);
    });
  });

  // TODO: fix and re-write for wallet-connect
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should call ethereum function `on` twice & `request` only once on unsuccessful login', async () => {
    expect.hasAssertions();
    delete window.ethereum; // delete previously set window mock.

    const ethereumCopy = {
      isMetaMask: true,
      on: jest.fn(),
      request: jest.fn(({ method }) => {
        if (method === CONSTANTS.ETH_REQUESTACCOUNTS) {
          return Promise.reject(new Error('Rejected'));
        }
        if (method === CONSTANTS.ETH_GETBALANCE) {
          return Promise.reject(new Error('Rejected'));
        }
        return Promise.resolve([]);
      }),
    };

    Object.defineProperty(window, 'ethereum', {
      value: ethereumCopy,
      configurable: true,
    });

    const { container } = render(wrapProvider(<Login />, true));
    const connectBtn = container.querySelector('.ant-btn-primary');

    // click connect button & expect mock function to be called
    userEvent.click(connectBtn);

    await waitFor(async () => {
      expect(ethereumCopy.on).toHaveBeenCalledTimes(2);

      // will be called only once because getBalance() won't be called if login fails
      expect(ethereumCopy.request).toHaveBeenCalledTimes(1);
    });
  });

  it('should render address once logged in', async () => {
    expect.hasAssertions();
    const { getByTestId } = render(wrapProvider(<Login />));
    const address = getByTestId('wallet-address').textContent;
    await waitFor(async () => {
      expect(address).toBe(getTrimmedText(dummyAddress, 6));
    });
  });
});
