import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Component from 'components/ListComponents/details';
import { getComponentDetails, getComponentHashes, getComponentOwner } from 'components/ListComponents/utils';
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
}));

const dummyDetails = {
  owner: dummyAddress,
  developer: dummyAddress,
  dependencies: [1, 2],
};

const dummyHashes = {
  componentHashes: ['Component Hash1', 'Component Hash2'],
};

describe('listComponents/details.jsx', () => {
  getComponentDetails.mockImplementation(() => Promise.resolve(dummyDetails));
  getComponentHashes.mockImplementation(() => Promise.resolve(dummyHashes));
  getComponentOwner.mockImplementation(() => Promise.resolve(dummyDetails.owner));

  it('should render component details', async () => {
    expect.hasAssertions();
    const {
      container, getAllByText, getByTestId,
    } = render(wrapProvider(<Component />));
    await waitFor(async () => {
      expect(container.querySelector('.ant-typography').textContent).toBe(
        'Component ID 1',
      );
      expect(getAllByText(dummyDetails.developer)).toHaveLength(2);
      expect(getByTestId('hashes-list').childElementCount).toBe(2);
      expect(getByTestId('details-dependency')).toBeInTheDocument();
    });
  });
});
