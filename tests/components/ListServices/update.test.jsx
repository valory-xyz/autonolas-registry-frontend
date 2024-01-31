/* eslint-disable jest/max-expects */
import React from 'react';
import { useRouter } from 'next/router';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import Update from 'components/ListServices/update';
import { FORM_NAME } from 'components/ListServices/helpers/RegisterForm';
import {
  getServiceContract,
  getServiceManagerContract,
} from 'common-util/Contracts';
import {
  getServiceDetails,
  getServiceOwner,
} from 'components/ListServices/utils';
import { wrapProvider, dummyAddress, mockV1Hash } from '../../helpers';

jest.mock('common-util/List/IpfsHashGenerationModal/helpers', () => ({
  getIpfsHashHelper: jest.fn(() => mockV1Hash),
}));

jest.mock('components/ListServices/utils', () => ({
  getServices: jest.fn(),
  getFilteredServices: jest.fn(),
  getServiceOwner: jest.fn(),
  getServiceDetails: jest.fn(),
}));

jest.mock('common-util/Contracts', () => ({
  getServiceContract: jest.fn(),
  getServiceManagerContract: jest.fn(),
}));

const SERVICE_1 = {
  owner: dummyAddress,
  agentIds: ['1'],
  agentParams: [['1', '1000']],
  threshold: '5',
  id: 1,
  configHash:
    '0x1348530ee33734f1d85cf0cdab13181c8c18c051a589a185f52fc0c740a4d5fa',
};

// TODO: fix with antd form
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('listServices/service.jsx', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getServiceContract.mockImplementation(() => ({
      methods: {
        getService: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(SERVICE_1)),
        })),
      },
    }));

    getServiceManagerContract.mockImplementation(() => ({
      methods: {
        serviceUpdate: jest.fn(() => ({
          send: jest.fn(() => Promise.resolve({})),
        })),
      },
    }));

    useRouter.mockImplementation(() => ({ push: jest.fn() }));
    getServiceDetails.mockResolvedValue(SERVICE_1);
    getServiceOwner.mockResolvedValue(dummyAddress);
    useRouter.mockImplementation(() => ({
      push: jest.fn(),
      query: { id: 1 },
    }));
  });

  it('should update the service successfully', async () => {
    expect.hasAssertions();
    const { container, getByRole } = render(
      wrapProvider(<Update isUpdateForm />),
    );

    await waitFor(async () => {
      expect(container.querySelector(`#${FORM_NAME}_owner_address`).value).toBe(
        dummyAddress,
      );
      expect(container.querySelector(`#${FORM_NAME}_agent_ids`).value).toBe(
        '1',
      );
      expect(
        container.querySelector(`#${FORM_NAME}_agent_num_slots`).value,
      ).toBe('1');
      expect(container.querySelector(`#${FORM_NAME}_hash`).value).toBe(
        SERVICE_1.configHash,
      );
      expect(container.querySelector(`#${FORM_NAME}_bonds`).value).toBe('1000');
      expect(container.querySelector(`#${FORM_NAME}_threshold`).value).toBe(
        '5',
      );

      const submitButton = getByRole('button', { name: 'Submit' });
      expect(submitButton).toBeInTheDocument();

      await act(async () => {
        userEvent.click(submitButton);
      });
    });
  });
});
