import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Services from 'components/ListServices/details';
import { getServiceDetails } from 'components/ListServices/utils';
import { dummyAddress, wrapProvider } from '../../helpers';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter() {
    return { query: { id: '1' } };
  },
}));

jest.mock('components/ListServices/utils', () => ({
  getServiceDetails: jest.fn(),
}));

const dummyDetails = {
  owner: dummyAddress,
  name: 'Service One',
  description: 'Service Description',
  agentIds: ['1'],
  agentNumSlots: ['1'],
  threshold: '5',
  id: 1,
};

describe('listServices/details.jsx', () => {
  getServiceDetails.mockImplementation(() => Promise.resolve(dummyDetails));

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
      expect(getByText('Threshold')).toBeInTheDocument();
      expect(getByTestId('agentNumSlots-dependency')).toHaveTextContent(1);
    });
  });
});
