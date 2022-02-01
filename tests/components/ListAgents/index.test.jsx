import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ListAgents from 'components/ListAgents';
import Agent from 'components/ListAgents/agent';
import { getAgents, getAgentsByAccount } from 'components/ListAgents/utils';
// import { URL } from 'util/constants';
import { useRouter } from 'next/router';
import { wrapProvider } from '../../helpers';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('components/ListAgents/utils', () => ({
  getAgents: jest.fn(),
  getAgentsByAccount: jest.fn(),
}));

useRouter.mockImplementation(() => ({ push: jest.fn() }));

describe('<ListAgents /> index.jsx', () => {
  it('works as expected', async () => {
    expect.hasAssertions();
    getAgents.mockImplementation(() => Promise.resolve([{ name: 'ALL TAB CONTENT' }]));
    getAgentsByAccount.mockImplementation(() => Promise.resolve([{ name: 'MY AGENTS CONTENT' }]));

    const { container, getByText } = render(wrapProvider(<ListAgents />));

    // check if the selected tab is `All` & has the correct content
    await waitFor(async () => expect(
      container.querySelector('.ant-tabs-tab-active > div').textContent,
    ).toBe('All'));
    expect(getByText(/ALL TAB CONTENT/i)).toBeInTheDocument();

    // click the `My agents` tab
    userEvent.click(container.querySelector('.ant-tabs-tab:nth-child(2)'));

    // check if the selected tab is `My agents` & has the correct content
    await waitFor(async () => expect(
      container.querySelector('.ant-tabs-tab-active > div').textContent,
    ).toBe('My Agents'));
    expect(getByText(/MY AGENTS CONTENT/i)).toBeInTheDocument();

    // const router = useRouter();
    userEvent.click(getByText(/Register/i));

    // it should be called once
    expect(useRouter).toHaveBeenCalledTimes(1);

    // TODO: push should be called once as well
    // const router = useRouter();
    // expect(router.push).toHaveBeenCalledTimes(1);
  });
});

describe('<ListAgents /> agent.jsx', () => {
  it('works as expected', async () => {
    expect.hasAssertions();
    const { container } = render(wrapProvider(<Agent />));
    await waitFor(async () => expect(container.querySelector('.ant-typography').textContent).toBe(
      'Agent',
    ));
  });
});
