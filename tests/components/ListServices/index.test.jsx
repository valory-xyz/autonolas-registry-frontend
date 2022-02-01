import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ListServices from 'components/ListServices';
import {
  getServices,
  getServicesByAccount,
} from 'components/ListServices/utils';
import { useRouter } from 'next/router';
import { getServiceContract } from 'common-util/Contracts';
import { wrapProvider, ACTIVE_TAB } from '../../helpers';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

jest.mock('components/ListServices/utils', () => ({
  getServices: jest.fn(),
  getServicesByAccount: jest.fn(),
}));

jest.mock('common-util/Contracts', () => ({
  getServiceContract: jest.fn(),
  getServiceManagerContract: jest.fn(),
}));

const SERVICE_1 = { name: 'Service One' };

getServiceContract.mockImplementation(() => ({
  methods: {
    getServiceInfo: jest.fn(() => ({
      call: jest.fn(() => Promise.resolve(SERVICE_1)),
    })),
  },
}));

useRouter.mockImplementation(() => ({ push: jest.fn() }));

describe('listServices/index.jsx', () => {
  getServices.mockImplementation(() => Promise.resolve([{ name: 'ALL TAB CONTENT' }]));
  getServicesByAccount.mockImplementation(() => Promise.resolve([{ name: 'MY SERVICES CONTENT' }]));

  it('should render tabs with `All Tab` as active tab & Register button', async () => {
    expect.hasAssertions();

    const { container, getByText, getByRole } = render(
      wrapProvider(<ListServices />),
    );
    // check if the selected tab is `All` & has the correct content
    await waitFor(async () => {
      expect(container.querySelector(ACTIVE_TAB).textContent).toBe('All');
    });
    expect(getByText(/ALL TAB CONTENT/i)).toBeInTheDocument();

    // Register button
    expect(getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });

  it('should render tabs with `All Services` as active tab & Register button', async () => {
    expect.hasAssertions();
    const { container, getByText, getByRole } = render(
      wrapProvider(<ListServices />),
    );

    // click the `My services` tab
    userEvent.click(container.querySelector('.ant-tabs-tab:nth-child(2)'));

    // check if the selected tab is `My services` & has the correct content
    await waitFor(async () => expect(container.querySelector(ACTIVE_TAB).textContent).toBe(
      'My Services',
    ));
    expect(getByText(/MY SERVICES CONTENT/i)).toBeInTheDocument();

    // Register button
    expect(getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });
});
