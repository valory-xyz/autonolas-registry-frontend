import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import ListServices from 'components/ListServices';
import {
  getServices,
  getServicesByAccount,
} from 'components/ListServices/utils';
import { useRouter } from 'next/router';
import { getServiceContract } from 'common-util/Contracts';
import { wrapProvider } from '../../helpers';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
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

describe('<ListServices /> index.jsx', () => {
  it('works as expected', async () => {
    expect.hasAssertions();
    getServices.mockImplementation(() => Promise.resolve([{ name: 'ALL TAB CONTENT' }]));
    getServicesByAccount.mockImplementation(() => Promise.resolve([{ name: 'MY SERVICES CONTENT' }]));

    const { container, getByText } = render(wrapProvider(<ListServices />));
    // check if the selected tab is `All` & has the correct content
    await waitFor(async () => {
      expect(
        container.querySelector('.ant-tabs-tab-active > div').textContent,
      ).toBe('All');
    });
    expect(getByText(/ALL TAB CONTENT/i)).toBeInTheDocument();

    // click the `My services` tab
    fireEvent.click(container.querySelector('.ant-tabs-tab:nth-child(2)'));

    // check if the selected tab is `My services` & has the correct content
    await waitFor(async () => expect(
      container.querySelector('.ant-tabs-tab-active > div').textContent,
    ).toBe('My Services'));
    expect(getByText(/MY SERVICES CONTENT/i)).toBeInTheDocument();

    const registerButton = container.querySelector(
      '.ant-tabs-extra-content > .ant-btn',
    );
    expect(registerButton).toBeEnabled();

    fireEvent.click(registerButton);

    // TODO: push should be called once as well
    // const router = useRouter();
    // await waitFor(async () => expect(router.push).toHaveBeenCalledTimes(0));
  });
});
