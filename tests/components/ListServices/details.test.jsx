import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { GATEWAY_URL } from 'util/constants';
import Services from 'components/ListServices/details';
import {
  getServiceTableDataSource,
  getAgentInstanceAndOperator,
  getServiceAgentInstances,
  getBonds,
} from 'common-util/Details/ServiceState/utils';
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
  mockIpfs,
  mockCodeUri,
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

jest.mock('components/ListServices/utils', () => ({
  getServiceDetails: jest.fn(),
  getServiceHashes: jest.fn(),
  getServiceOwner: jest.fn(),
  getTokenUri: jest.fn(),
}));

jest.mock('common-util/Details/ServiceState/utils', () => ({
  getServiceTableDataSource: jest.fn(),
  getAgentInstanceAndOperator: jest.fn(),
  getServiceAgentInstances: jest.fn(),
  getBonds: jest.fn(),
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
      json: () => Promise.resolve(mockIpfs),
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
  getServiceAgentInstances.mockImplementation(() => Promise.resolve(['1']));
  getServiceTableDataSource.mockImplementation(() => Promise.resolve([
    {
      key: 1,
      agentId: '1',
      availableSlots: 1,
      totalSlots: '1',
      bond: 10000000000000,
      agentAddresses: null,
    },
  ]));
  getAgentInstanceAndOperator.mockImplementation(() => Promise.resolve([
    {
      id: 'agent-instance-row-1',
      operatorAddress: 'operator_address_1',
      agentInstance: 'agent_instance_1',
    },
  ]));

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should render service details', async () => {
    expect.hasAssertions();
    const { container, getByText, getByTestId } = render(
      wrapProvider(<Services />),
    );
    await waitFor(async () => {
      expect(getByText('Service ID 1')).toBeInTheDocument();
      expect(getByTestId('service-status').textContent).toBe('Inactive');
      expect(getByTestId('view-hash-link').getAttribute('href')).toBe(
        `${GATEWAY_URL}12345`,
      );
      expect(getByTestId('view-code-link').getAttribute('href')).toBe(
        `${GATEWAY_URL}${mockCodeUri}`,
      );

      // NFT image (display on left side for services)
      const displayedImage = getByTestId('service-nft-image').querySelector('img');
      expect(displayedImage.src).toBe(`${GATEWAY_URL}${mockNftImageHash}`);

      expect(getByTestId('description').textContent).toBe(mockIpfs.description);
      expect(getByTestId('version').textContent).toBe(
        mockIpfs.attributes[0].value,
      );
      expect(getByTestId('owner-address').textContent).toBe(dummyDetails.owner);
      expect(getByText('Threshold')).toBeInTheDocument();

      // state (right-side content)
      const getTitle = (i) => container.querySelector(
        `.ant-steps-item:nth-child(${i}) .ant-steps-item-title`,
      );
      expect(getTitle(1)).toHaveTextContent('Pre-Registration');
      expect(getTitle(2)).toHaveTextContent('Active Registration');
      expect(getTitle(3)).toHaveTextContent('Finished Registration');
      expect(getTitle(4)).toHaveTextContent('Deployed');
      expect(getTitle(5)).toHaveTextContent('Terminated Bonded');
    });
  });
});
