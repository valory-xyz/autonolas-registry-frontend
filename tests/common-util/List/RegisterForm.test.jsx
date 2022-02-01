import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm, { FORM_NAME } from 'common-util/List/RegisterForm';
import { wrapProvider, dummyAddress } from '../../helpers';

const handleSubmit = jest.fn(() => {});
const handleCancel = jest.fn(() => {});

describe('<RegisterForm />', () => {
  it('should submit the form successfully', async () => {
    expect.hasAssertions();
    const { container } = render(
      wrapProvider(
        <RegisterForm
          listType="agent"
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
        />,
      ),
    );

    // adding input
    userEvent.type(
      container.querySelector(`#${FORM_NAME}_owner_address`),
      dummyAddress,
    );
    userEvent.type(
      container.querySelector(`#${FORM_NAME}_developer_address`),
      dummyAddress,
    );
    userEvent.type(container.querySelector(`#${FORM_NAME}_hash`), '0x0');
    userEvent.type(
      container.querySelector(`#${FORM_NAME}_description`),
      'desc',
    );
    userEvent.type(
      container.querySelector(`#${FORM_NAME}_dependencies`),
      '1, 2',
    );

    // submit
    userEvent.click(container.querySelector('.ant-btn[type="submit"]'));

    await waitFor(async () => {
      // screen.debug();
      expect(handleSubmit.mock.calls).toHaveLength(1);
    });
  });
});
