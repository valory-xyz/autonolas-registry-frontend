import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getServiceManagerContract } from 'common-util/Contracts';
import RegisterService from 'components/ListServices/register';
import { FORM_NAME } from 'components/ListServices/RegisterForm';
import { act } from 'react-dom/test-utils';
import { wrapProvider, dummyAddress } from '../../helpers';

const NEW_SERVICE = { name: 'New Service One' };

jest.mock('common-util/Contracts', () => ({
  getServiceManagerContract: jest.fn(),
}));

getServiceManagerContract.mockImplementation(() => ({
  methods: {
    create: jest.fn(() => ({
      send: jest.fn(() => Promise.resolve(NEW_SERVICE)),
    })),
  },
}));

describe('listServices/register.jsx', () => {
  it('should submit the form successfully', async () => {
    expect.hasAssertions();

    const { container, getByText, getByRole } = render(
      wrapProvider(<RegisterService />),
    );
    // title
    expect(getByText(/Register Service/i)).toBeInTheDocument();

    // check if submit button is present
    expect(container.querySelector('.ant-btn[type="submit"]')).toBeTruthy();

    userEvent.type(
      container.querySelector(`#${FORM_NAME}_owner_address`),
      dummyAddress,
    );
    userEvent.type(
      container.querySelector(`#${FORM_NAME}_hash`),
      '0x3bfd5d69e3e95cb178c2a0dd8868d10667a6e4695c5d0c52c8f5d7e2b7f6f801',
    );
    userEvent.type(container.querySelector(`#${FORM_NAME}_agent_ids`), '1');
    userEvent.type(
      container.querySelector(`#${FORM_NAME}_agent_num_slots`),
      '1',
    );
    userEvent.type(container.querySelector(`#${FORM_NAME}_bonds`), '1');
    userEvent.type(container.querySelector(`#${FORM_NAME}_threshold`), '1');

    const submitButton = getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeInTheDocument();

    await act(async () => {
      userEvent.click(submitButton);
    });
  });
});
