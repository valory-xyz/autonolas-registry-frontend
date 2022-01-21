import React from 'react';
import { fireEvent, render } from '@testing-library/react';
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

describe('<ListServices /> register.jsx', () => {
  it('works as expected', async () => {
    expect.hasAssertions();

    const { container, getByText } = render(wrapProvider(<RegisterService />));
    await act(async () => {
      // title
      expect(getByText(/Register Service/i)).toBeInTheDocument();

      // check if submit button is present
      expect(container.querySelector('.ant-btn[type="submit"]')).toBeTruthy();

      fireEvent.change(container.querySelector(`#${FORM_NAME}_owner_address`), {
        target: { value: dummyAddress },
      });
      fireEvent.change(container.querySelector(`#${FORM_NAME}_service_name`), {
        target: { value: 'Service Name' },
      });
      fireEvent.change(
        container.querySelector(`#${FORM_NAME}_service_description`),
        {
          target: { value: 'Desc' },
        },
      );
      fireEvent.change(container.querySelector(`#${FORM_NAME}_agent_ids`), {
        target: { value: '1' },
      });
      fireEvent.change(
        container.querySelector(`#${FORM_NAME}_agent_num_slots`),
        {
          target: { value: '1' },
        },
      );
      fireEvent.change(container.querySelector(`#${FORM_NAME}_threshold`), {
        target: { value: '1' },
      });

      const submitBtn = getByText(/Submit/i);
      expect(submitBtn).toBeInTheDocument();
      fireEvent.click(submitBtn);
      // expect(submitBtn).toHaveBeenCalledTimes(1);
    });
  });
});
