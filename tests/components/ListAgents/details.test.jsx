import React from 'react';
import { render, waitFor } from '@testing-library/react';
import AgentDetails from 'components/ListAgents/details';
import {
  getAgentDetails,
  getAgentHashes,
  getAgentOwner,
} from 'components/ListAgents/utils';
import { dummyAddress, wrapProvider } from '../../helpers';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter() {
    return { query: { id: '1' } };
  },
}));

jest.mock('components/ListAgents/utils', () => ({
  getAgentDetails: jest.fn(),
  getAgentHashes: jest.fn(),
  getAgentOwner: jest.fn(),
}));

const dummyDetails = {
  owner: dummyAddress,
  developer: dummyAddress,
  dependencies: [1, 2],
};

const dummyHashes = {
  agentHashes: ['Agent Hash1', 'Agent Hash2'],
};

describe('listAgents/details.jsx', () => {
  getAgentDetails.mockImplementation(() => Promise.resolve(dummyDetails));
  getAgentHashes.mockImplementation(() => Promise.resolve(dummyHashes));
  getAgentOwner.mockImplementation(() => Promise.resolve(dummyDetails.owner));

  it('should render agent details', async () => {
    expect.hasAssertions();
    const { container, getAllByText, getByTestId } = render(
      wrapProvider(<AgentDetails />),
    );
    await waitFor(async () => {
      expect(container.querySelector('.ant-typography').textContent).toBe(
        'Agent ID 1',
      );
      expect(getAllByText(dummyDetails.developer)).toHaveLength(2);
      expect(getByTestId('hashes-list').childElementCount).toBe(2);
      expect(getByTestId('details-dependency')).toBeInTheDocument();
    });
  });
});
