import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Component from 'components/ListComponents/details';
import {
  getComponentDetails,
  getComponentHashes,
  getComponentOwner,
  getTokenUri,
} from 'components/ListComponents/utils';
import { dummyAddress, wrapProvider } from '../../helpers';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter() {
    return { query: { id: '1' } };
  },
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

describe('listComponents/details.jsx', () => {
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
      expect(getByTestId('hashes-list')).toHaveTextContent(
        dummyDetails.tokenUrl,
      );
      expect(getByRole('button', { name: 'Update Hash' })).toBeInTheDocument();
      expect(getByTestId('details-dependency')).toBeInTheDocument();
    });
  });
});
