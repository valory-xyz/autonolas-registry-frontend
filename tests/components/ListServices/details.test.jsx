import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { GATEWAY_URL } from 'util/constants';
import Services from 'components/ListServices/details';
import { getAgentSlots, getBonds } from 'components/ListServices/RegisterForm';
import { getServiceTableDataSource } from 'common-util/Details/ServiceState/utils';
import {
  getServiceDetails,
  getServiceHashes,
  getServiceOwner,
  getTokenUri,
} from 'components/ListServices/utils';
import {
  dummyAddress,
  wrapProvider,
  mockNftImageHash,
  mockV1Hash,
} from '../../helpers';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter() {
    return { query: { id: '1' } };
  },
}));

jest.mock('common-util/List/IpfsHashGenerationModal/helpers', () => ({
  getIpfsHashHelper: jest.fn(() => mockV1Hash),
}));

jest.mock('components/ListServices/RegisterForm', () => ({
  getBonds: jest.fn(),
  getAgentSlots: jest.fn(),
}));

jest.mock('components/ListServices/utils', () => ({
  getServiceDetails: jest.fn(),
  getServiceHashes: jest.fn(),
  getServiceOwner: jest.fn(),
  getTokenUri: jest.fn(),
}));

jest.mock('common-util/Details/ServiceState/utils', () => ({
  getServiceTableDataSource: jest.fn(),
}));

const dummyDetails = {
  owner: dummyAddress,
  agentIds: ['1'],
  agentParams: [
    ['1', '1000'],
    ['2', '1000'],
    ['3', '1000'],
  ],
  threshold: '5',
  id: 1,
  tokenUrl: 'https://localhost/service/12345',
};

const dummyHashes = {
  configHashes: ['Service Hash1', 'Service Hash2'],
};

const unmockedFetch = global.fetch;

describe('listServices/details.jsx', () => {
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

  getServiceDetails.mockImplementation(() => Promise.resolve(dummyDetails));
  getServiceHashes.mockImplementation(() => Promise.resolve(dummyHashes));
  getServiceOwner.mockImplementation(() => Promise.resolve(dummyAddress));
  getTokenUri.mockImplementation(() => Promise.resolve(dummyDetails.tokenUrl));
  getBonds.mockImplementation(() => Promise.resolve(['1']));
  getAgentSlots.mockImplementation(() => Promise.resolve(['1']));
  getServiceTableDataSource.mockImplementation(() => Promise.resolve([
    {
      key: 1,
      agentId: '1',
      availableSlots: 1,
      totalSlots: '1',
      agentAddresses: null,
    },
  ]));

  it('should render service details', async () => {
    expect.hasAssertions();
    const { container, getByText, getByTestId } = render(
      wrapProvider(<Services />),
    );
    await waitFor(async () => {
      expect(container.querySelector('.ant-typography').textContent).toBe(
        'Service ID 1',
      );
      expect(getByTestId('owner-address').textContent).toBe(dummyDetails.owner);
      expect(getByTestId('agent-id-table')).toBeInTheDocument();
      expect(getByText('Threshold')).toBeInTheDocument();

      // NFT image
      const displayedImage = getByTestId('nft-image').querySelector('img');
      expect(displayedImage.src).toBe(`${GATEWAY_URL}${mockNftImageHash}`);

      // state (left-side content)
      const getTitle = (i) => container.querySelector(
        `.ant-steps-item:nth-child(${i}) .ant-steps-item-title`,
      );
      expect(getTitle(1).textContent).toBe('Pre-Registration');
      expect(getTitle(2).textContent).toBe('Active Registration');
      expect(getTitle(3).textContent).toBe('Finished Registration');
      expect(getTitle(4).textContent).toBe('Deployed');
      expect(getTitle(5).textContent).toBe('Terminated Bonded');
    });
  });
});
