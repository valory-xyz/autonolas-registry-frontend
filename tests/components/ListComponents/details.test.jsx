import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { GATEWAY_URL } from 'util/constants';
import Component from 'components/ListComponents/details';
import {
  getComponentDetails,
  getComponentHashes,
  getComponentOwner,
  getTokenUri,
} from 'components/ListComponents/utils';
import {
  dummyAddress,
  wrapProvider,
  mockV1Hash,
  mockNftImageHash,
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

jest.mock('components/ListComponents/utils', () => ({
  getComponentDetails: jest.fn(),
  getComponentHashes: jest.fn(),
  getComponentOwner: jest.fn(),
  getTokenUri: jest.fn(),
}));

const dummyDetails = {
  owner: dummyAddress,
  developer: dummyAddress,
  dependencies: [1, 2],
  tokenUrl: 'https://localhost/component/12345',
};

const dummyHashes = {
  componentHashes: ['Component Hash1', 'Component Hash2'],
};

const unmockedFetch = global.fetch;

describe('listComponents/details.jsx', () => {
  beforeAll(() => {
    global.fetch = () => Promise.resolve({
      json: () => Promise.resolve(mockIpfs),
    });
  });

  afterAll(() => {
    global.fetch = unmockedFetch;
  });

  getComponentDetails.mockImplementation(() => Promise.resolve(dummyDetails));
  getComponentHashes.mockImplementation(() => Promise.resolve(dummyHashes));
  getComponentOwner.mockImplementation(() => Promise.resolve(dummyDetails.owner));
  getTokenUri.mockImplementation(() => Promise.resolve(dummyDetails.tokenUrl));

  it('should render component details', async () => {
    expect.hasAssertions();
    const { getByText, getByRole, getByTestId } = render(
      wrapProvider(<Component />),
    );
    await waitFor(async () => {
      // left column content
      expect(getByText('Component ID 1')).toBeInTheDocument();
      expect(getByTestId('view-hash-link').getAttribute('href')).toBe(
        `${GATEWAY_URL}12345`,
      );
      expect(getByTestId('view-code-link').getAttribute('href')).toBe(
        `${GATEWAY_URL}${mockCodeUri}`,
      );
      expect(getByTestId('description').textContent).toBe(mockIpfs.description);
      expect(getByTestId('version').textContent).toBe(
        mockIpfs.attributes[0].value,
      );
      expect(getByTestId('owner-address').textContent).toBe(
        dummyDetails.developer,
      );
      expect(getByRole('button', { name: 'Update Hash' })).toBeInTheDocument();
      expect(getByTestId('details-dependency')).toBeInTheDocument();

      // NFT image
      const nftImage = getByTestId('nft-image').querySelector('.ant-image-img');
      expect(nftImage.getAttribute('src')).toBe(
        `${GATEWAY_URL}${mockNftImageHash}`,
      );
    });
  });
});
