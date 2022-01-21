import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Service from 'components/ListServices/service';
import { FORM_NAME } from 'components/ListServices/RegisterForm';
// import { URL } from 'util/constants';
import { useRouter } from 'next/router';
import {
  getServiceContract,
  getServiceManagerContract,
} from 'common-util/Contracts';
import { wrapProvider, dummyAddress } from '../../helpers';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    query: {},
  })),
}));

jest.mock('components/ListServices/utils', () => ({
  getServices: jest.fn(),
  getServicesByAccount: jest.fn(),
}));

jest.mock('common-util/Contracts', () => ({
  getServiceContract: jest.fn(),
  getServiceManagerContract: jest.fn(),
}));

const SERVICE_1 = {
  owner: dummyAddress,
  name: 'Service One',
  description: 'Service Description',
  agentIds: ['1'],
  agentNumSlots: ['1'],
  threshold: '5',
  id: 1,
};

getServiceContract.mockImplementation(() => ({
  methods: {
    getServiceInfo: jest.fn(() => ({
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

describe('<ListServices /> service.jsx', () => {
  it('works as expected', async () => {
    expect.hasAssertions();
    const { container, getByText } = render(wrapProvider(<Service />));

    await waitFor(async () => {
      expect(container.querySelector(`#${FORM_NAME}_owner_address`).value).toBe(
        dummyAddress,
      );
      expect(container.querySelector(`#${FORM_NAME}_service_name`).value).toBe(
        'Service One',
      );
      expect(
        container.querySelector(`#${FORM_NAME}_service_description`).value,
      ).toBe('Service Description');
      expect(container.querySelector(`#${FORM_NAME}_agent_ids`).value).toBe(
        '1',
      );
      expect(
        container.querySelector(`#${FORM_NAME}_agent_num_slots`).value,
      ).toBe('1');
      expect(container.querySelector(`#${FORM_NAME}_threshold`).value).toBe(
        '5',
      );

      const submitBtn = getByText(/Submit/i);
      expect(submitBtn).toBeInTheDocument();
      // fireEvent.click(submitBtn);
    });
  });
});
