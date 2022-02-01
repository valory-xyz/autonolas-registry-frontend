import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ListComponents from 'components/ListComponents';
import Component from 'components/ListComponents/component';
import {
  getComponents,
  getComponentsByAccount,
} from 'components/ListComponents/utils';
import { useRouter } from 'next/router';
import { wrapProvider, ACTIVE_TAB } from '../../helpers';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('components/ListComponents/utils', () => ({
  getComponents: jest.fn(),
  getComponentsByAccount: jest.fn(),
}));

useRouter.mockImplementation(() => ({ push: jest.fn() }));

describe('listComponents/index.jsx', () => {
  getComponents.mockImplementation(() => Promise.resolve([{ name: 'ALL TAB CONTENT' }]));
  getComponentsByAccount.mockImplementation(() => Promise.resolve([{ name: 'MY COMPONENTS CONTENT' }]));

  it('should render tabs with `All Tab` as active tab & Register button', async () => {
    expect.hasAssertions();

    const { container, getByText, getByRole } = render(
      wrapProvider(<ListComponents />),
    );

    // check if the selected tab is `All` & has the correct content
    await waitFor(async () => expect(container.querySelector(ACTIVE_TAB).textContent).toBe('All'));
    expect(getByText(/ALL TAB CONTENT/i)).toBeInTheDocument();

    // it should be called once
    expect(useRouter).toHaveBeenCalledTimes(1);

    expect(getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });

  it('should render tabs with `My Components` as active tab & Register button', async () => {
    expect.hasAssertions();

    const { container, getByText, getByRole } = render(
      wrapProvider(<ListComponents />),
    );

    // click the `My components` tab
    userEvent.click(container.querySelector('.ant-tabs-tab:nth-child(2)'));

    // check if the selected tab is `My components` & has the correct content
    await waitFor(async () => expect(container.querySelector(ACTIVE_TAB).textContent).toBe(
      'My Components',
    ));
    expect(getByText(/MY COMPONENTS CONTENT/i)).toBeInTheDocument();

    // Register button
    expect(getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });
});

describe('listComponents/component.jsx', () => {
  it('should render header as `Component`', async () => {
    expect.hasAssertions();
    const { container } = render(wrapProvider(<Component />));
    await waitFor(async () => expect(container.querySelector('.ant-typography').textContent).toBe(
      'Component',
    ));
  });
});
