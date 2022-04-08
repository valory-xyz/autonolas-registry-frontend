import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Services from 'components/ListServices/details';
import {
  getServiceDetails,
  getServiceHashes,
  getServiceStatus,
} from 'components/ListServices/utils';
import { dummyAddress, wrapProvider } from '../../helpers';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter() {
    return { query: { id: '1' } };
  },
}));

jest.mock('components/ListServices/utils', () => ({
  getServiceDetails: jest.fn(),
  getServiceHashes: jest.fn(),
  getServiceStatus: jest.fn(),
}));

const dummyDetails = {
  owner: dummyAddress,
  name: 'Service One',
  description: 'Service Description',
  agentIds: ['1'],
  agentParams: [['1', '1000'], ['2', '1000'], ['3', '1000']],
  threshold: '5',
  id: 1,
};

const dummyHashes = {
  configHashes: ['Service Hash1', 'Service Hash2'],
};

const dummyServiceState = '1';

describe('listServices/details.jsx', () => {
  getServiceDetails.mockImplementation(() => Promise.resolve(dummyDetails));
  getServiceHashes.mockImplementation(() => Promise.resolve(dummyHashes));
  getServiceStatus.mockImplementation(() => Promise.resolve(dummyServiceState));


  it('should render service details', async () => {
    expect.hasAssertions();
    const { container, getByText, getByTestId } = render(
      wrapProvider(<Services />),
    );
    await waitFor(async () => {
      expect(container.querySelector('.ant-typography').textContent).toBe(
        'Service ID 1',
      );
      expect(getByText(dummyDetails.owner)).toBeInTheDocument();
      expect(getByText(dummyDetails.description)).toBeInTheDocument();
      expect(getByTestId('hashes-list').childElementCount).toBe(2);
      expect(getByTestId('agent-id-table')).toBeInTheDocument();
      expect(getByText('Threshold')).toBeInTheDocument();
    });
  });
});
