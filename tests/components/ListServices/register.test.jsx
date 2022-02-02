import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getServiceManagerContract } from 'common-util/Contracts';
import RegisterService from 'components/ListServices/register';
import { FORM_NAME } from 'components/ListServices/RegisterForm';
import { act } from 'react-dom/test-utils';
import { wrapProvider, dummyAddress } from '../../helpers';

jest.mock('common-util/Contracts', () => ({
  getServiceManagerContract: jest.fn(),
}));

getServiceManagerContract.mockImplementation(() => ({
  methods: {
    serviceCreate: jest.fn(() => ({
      send: jest.fn(() => Promise.resolve({ name: 'Hello' })),
    })),
  },
}));

describe('listServices/register.jsx', () => {
  it('should submit the form successfully', async () => {
    expect.hasAssertions();

    const { container, getByText } = render(wrapProvider(<RegisterService />));
    // title
    expect(getByText(/Register Service/i)).toBeInTheDocument();

    // check if submit button is present
    expect(container.querySelector('.ant-btn[type="submit"]')).toBeTruthy();

    userEvent.type(
      container.querySelector(`#${FORM_NAME}_owner_address`),
      dummyAddress,
    );
    userEvent.type(
      container.querySelector(`#${FORM_NAME}_service_name`),
      'Service Name',
    );
    userEvent.type(
      container.querySelector(`#${FORM_NAME}_service_description`),
      'Desc',
    );
    userEvent.type(container.querySelector(`#${FORM_NAME}_agent_ids`), '1');
    userEvent.type(
      container.querySelector(`#${FORM_NAME}_agent_num_slots`),
      '1',
    );
    userEvent.type(container.querySelector(`#${FORM_NAME}_threshold`), '1');

    await act(async () => {
      const submitBtn = getByText(/Submit/i);
      expect(submitBtn).toBeInTheDocument();
      userEvent.click(submitBtn);
    });
  });
});
