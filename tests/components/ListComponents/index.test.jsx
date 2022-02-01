import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ListComponents from 'components/ListComponents';
import Component from 'components/ListComponents/component';
import { getComponents, getComponentsByAccount } from 'components/ListComponents/utils';
import { useRouter } from 'next/router';
import { wrapProvider } from '../../helpers';

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
  it('works as expected', async () => {
    expect.hasAssertions();
    getComponents.mockImplementation(() => Promise.resolve([{ name: 'ALL TAB CONTENT' }]));
    getComponentsByAccount.mockImplementation(() => Promise.resolve([{ name: 'MY COMPONENTS CONTENT' }]));

    const { container, getByText } = render(wrapProvider(<ListComponents />));

    // check if the selected tab is `All` & has the correct content
    await waitFor(async () => expect(
      container.querySelector('.ant-tabs-tab-active > div').textContent,
    ).toBe('All'));
    expect(getByText(/ALL TAB CONTENT/i)).toBeInTheDocument();

    // click the `My components` tab
    userEvent.click(container.querySelector('.ant-tabs-tab:nth-child(2)'));

    // check if the selected tab is `My components` & has the correct content
    await waitFor(async () => expect(
      container.querySelector('.ant-tabs-tab-active > div').textContent,
    ).toBe('My Components'));
    expect(getByText(/MY COMPONENTS CONTENT/i)).toBeInTheDocument();

    // const router = useRouter();
    userEvent.click(getByText(/Register/i));

    // it should be called once
    expect(useRouter).toHaveBeenCalledTimes(1);

    // TODO: push should be called once as well
    // const router = useRouter();
    // expect(router.push).toHaveBeenCalledTimes(1);
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
