import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ListAgents from 'components/ListAgents';
import Agent from 'components/ListAgents/agent';
import { getAgents, getAgentsByAccount } from 'components/ListAgents/utils';
import { useRouter } from 'next/router';
import { wrapProvider, ACTIVE_TAB } from '../../helpers';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('components/ListAgents/utils', () => ({
  getAgents: jest.fn(),
  getAgentsByAccount: jest.fn(),
}));

useRouter.mockImplementation(() => ({ push: jest.fn() }));

describe('listAgents/index.jsx', () => {
  getAgents.mockImplementation(() => Promise.resolve([{ name: 'ALL TAB CONTENT' }]));
  getAgentsByAccount.mockImplementation(() => Promise.resolve([{ name: 'MY AGENTS CONTENT' }]));

  it('should render tabs with `All Tab` as active tab & Register button', async () => {
    expect.hasAssertions();
    const { container, getByText, getByRole } = render(
      wrapProvider(<ListAgents />),
    );

    // check if the selected tab is `All` & has the correct content
    await waitFor(async () => expect(container.querySelector(ACTIVE_TAB).textContent).toBe('All'));
    expect(getByText(/ALL TAB CONTENT/i)).toBeInTheDocument();

    // it should be called once
    expect(useRouter).toHaveBeenCalledTimes(1);

    // Register button
    expect(getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });

  it('should render tabs with `My Agents` as active tab & Register button', async () => {
    expect.hasAssertions();
    const { container, getByText, getByRole } = render(
      wrapProvider(<ListAgents />),
    );

    // click the `My agents` tab
    userEvent.click(container.querySelector('.ant-tabs-tab:nth-child(2)'));

    // check if the selected tab is `My agents` & has the correct content
    await waitFor(async () => {
      expect(container.querySelector(ACTIVE_TAB).textContent).toBe('My Agents');
    });
    expect(getByText(/MY AGENTS CONTENT/i)).toBeInTheDocument();

    // Register button
    expect(getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });
});

describe('listAgents/agent.jsx', () => {
  it('should render header as `Agent`', async () => {
    expect.hasAssertions();
    const { container } = render(wrapProvider(<Agent />));
    await waitFor(async () => expect(container.querySelector('.ant-typography').textContent).toBe(
      'Agent',
    ));
  });
});
