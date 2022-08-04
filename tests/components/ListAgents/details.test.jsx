import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { GATEWAY_URL } from 'util/constants';
import AgentDetails from 'components/ListAgents/details';
import {
  getAgentDetails,
  getAgentHashes,
  getAgentOwner,
  getTokenUri,
} from 'components/ListAgents/utils';
import {
  dummyAddress,
  wrapProvider,
  mockNftImageHash,
  mockV1Hash,
} from '../../helpers';

jest.mock('common-util/List/IpfsHashGenerationModal/helpers', () => ({
  getIpfsHashHelper: jest.fn(() => mockV1Hash),
}));

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
  getTokenUri: jest.fn(),
}));

const dummyDetails = {
  owner: dummyAddress,
  developer: dummyAddress,
  dependencies: [1, 2],
  tokenUrl: 'https://localhost/component/12345',
};

const dummyHashes = {
  agentHashes: ['Agent Hash1', 'Agent Hash2'],
};

// This is the section where we mock `fetch`
const unmockedFetch = global.fetch;

describe('listAgents/details.jsx', () => {
  beforeAll(() => {
    global.fetch = () => Promise.resolve({
      json: () => Promise.resolve({
        image: `ipfs://${mockNftImageHash}`,
      }),
    });
  });

  afterAll(() => {
    global.fetch = unmockedFetch;
  });

  getAgentDetails.mockImplementation(() => Promise.resolve(dummyDetails));
  getAgentHashes.mockImplementation(() => Promise.resolve(dummyHashes));
  getAgentOwner.mockImplementation(() => Promise.resolve(dummyDetails.owner));
  getTokenUri.mockImplementation(() => Promise.resolve(dummyDetails.tokenUrl));

  it('should render agent details', async () => {
    expect.hasAssertions();
    const { container, getByTestId, getByRole } = render(
      wrapProvider(<AgentDetails />),
    );
    await waitFor(async () => {
      expect(container.querySelector('.ant-typography').textContent).toBe(
        'Agent ID 1',
      );
      expect(getByTestId('owner-address').textContent).toBe(
        dummyDetails.developer,
      );
      expect(getByTestId('hashes-list').querySelector('a')).toHaveTextContent(
        `${GATEWAY_URL}12345`,
      );
      expect(getByRole('button', { name: 'Update Hash' })).toBeInTheDocument();
      expect(getByTestId('details-dependency')).toBeInTheDocument();

      // NFT image
      const displayedImage = getByTestId('nft-image').querySelector('img');
      expect(displayedImage.src).toBe(`${GATEWAY_URL}${mockNftImageHash}`);
    });
  });
});
