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
      json: () => Promise.resolve({
        image: `ipfs://${mockNftImageHash}`,
      }),
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
    const { container, getByRole, getByTestId } = render(
      wrapProvider(<Component />),
    );
    await waitFor(async () => {
      expect(container.querySelector('.ant-typography').textContent).toBe(
        'Component ID 1',
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
