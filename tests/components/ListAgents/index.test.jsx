import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ListAgents from 'components/ListAgents';
import {
  getAgents,
  getFilteredAgents,
  getTotalForAllAgents,
  getTotalForMyAgents,
} from 'components/ListAgents/utils';
import { useRouter } from 'next/router';
import { wrapProvider, ACTIVE_TAB, getTableTd } from '../../helpers';

// mocks for router & smart-contract functions
jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('components/ListAgents/utils', () => ({
  getAgents: jest.fn(),
  getFilteredAgents: jest.fn(),
  getTotalForAllAgents: jest.fn(),
  getTotalForMyAgents: jest.fn(),
}));

// dummy responses mock
const allAgentsResponse = { id: '1', dependencies: ['4'] };
const myAgentsResponse = { id: '2', dependencies: ['5'] };

describe('listAgents/index.jsx', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockImplementation(() => ({ push: jest.fn() }));
    getAgents.mockImplementation(() => Promise.resolve([allAgentsResponse]));
    getFilteredAgents.mockImplementation(() => Promise.resolve([myAgentsResponse]));
    getTotalForAllAgents.mockImplementation(() => Promise.resolve(1));
    getTotalForMyAgents.mockImplementation(() => Promise.resolve(1));
  });

  it.skip('should render tabs with `All Tab` as active tab & Mint button', async () => {
    expect.hasAssertions();
    const { container, getByRole } = render(wrapProvider(<ListAgents />));

    // check if the selected tab is `All` & has the correct content
    await waitFor(async () => expect(container.querySelector(ACTIVE_TAB).textContent).toBe('All'));

    // ckecking Id, description column
    expect(container.querySelector(getTableTd(1)).textContent).toBe('1');
    expect(container.querySelector(getTableTd(4)).textContent).toBe(
      allAgentsResponse.dependencies.length.toString(),
    );
    expect(getByRole('button', { name: 'View' })).toBeInTheDocument();

    // it should be called once
    // expect(useRouter).toHaveBeenCalledTimes(1);

    // Mint button
    expect(getByRole('button', { name: 'Mint' })).toBeInTheDocument();
  });

  it('should render tabs with `My Agents` as active tab & Mint button', async () => {
    expect.hasAssertions();
    const { container, getByRole } = render(wrapProvider(<ListAgents />));

    // click the `My agents` tab
    userEvent.click(container.querySelector('.ant-tabs-tab:nth-child(2)'));

    // check if the selected tab is `My agents` & has the correct content
    await waitFor(async () => {
      expect(container.querySelector(ACTIVE_TAB).textContent).toBe('My Agents');
    });

    // Mint button
    expect(getByRole('button', { name: 'Mint' })).toBeInTheDocument();
  });
});
