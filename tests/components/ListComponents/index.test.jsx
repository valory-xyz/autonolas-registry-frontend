import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ListComponents from 'components/ListComponents';
import {
  getComponents,
  getComponentsByAccount,
} from 'components/ListComponents/utils';
import { useRouter } from 'next/router';
import { wrapProvider, ACTIVE_TAB, getTableTd } from '../../helpers';

// mocks for router & smart-contract functions
jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('components/ListComponents/utils', () => ({
  getComponents: jest.fn(),
  getComponentsByAccount: jest.fn(),
}));

useRouter.mockImplementation(() => ({ push: jest.fn() }));

// dummy responses mock
const allComponentResponse = { id: 'all-component-1', dependencies: ['1'] };
const myComponentResponse = { id: 'my-component-1', dependencies: ['2'] };

describe('listComponents/index.jsx', () => {
  getComponents.mockImplementation(() => Promise.resolve([allComponentResponse]));
  getComponentsByAccount.mockImplementation(() => Promise.resolve([myComponentResponse]));

  it('should render tabs with `All Tab` as active tab & Register button', async () => {
    expect.hasAssertions();

    const { container, getByRole } = render(wrapProvider(<ListComponents />));

    // check if the selected tab is `All` & has the correct content
    await waitFor(async () => expect(container.querySelector(ACTIVE_TAB).textContent).toBe('All'));

    // ckecking Id, description column
    expect(container.querySelector(getTableTd(1)).textContent).toBe('1');
    expect(container.querySelector(getTableTd(6)).textContent).toBe(
      allComponentResponse.dependencies.length.toString(),
    );

    // it should be called once
    expect(useRouter).toHaveBeenCalledTimes(1);

    expect(getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });

  it('should render tabs with `My Components` as active tab & Register button', async () => {
    expect.hasAssertions();

    const { container, getByRole } = render(wrapProvider(<ListComponents />));

    // click the `My components` tab
    userEvent.click(container.querySelector('.ant-tabs-tab:nth-child(2)'));

    // check if the selected tab is `My components` & has the correct content
    await waitFor(async () => expect(container.querySelector(ACTIVE_TAB).textContent).toBe(
      'My Components',
    ));

    // Register button
    expect(getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });
});
