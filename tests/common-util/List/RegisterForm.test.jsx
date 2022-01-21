import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import RegisterForm, { FORM_NAME } from 'common-util/List/RegisterForm';
import { wrapProvider, dummyAddress } from '../../helpers';

const handleSubmit = jest.fn(() => {});
const handleCancel = jest.fn(() => {});

describe('<RegisterForm />', () => {
  it('valid inputs & submitted successfully', async () => {
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
    fireEvent.change(container.querySelector(`#${FORM_NAME}_owner_address`), {
      target: { value: dummyAddress },
    });
    fireEvent.change(
      container.querySelector(`#${FORM_NAME}_developer_address`),
      {
        target: { value: dummyAddress },
      },
    );
    fireEvent.change(container.querySelector(`#${FORM_NAME}_hash`), {
      target: { value: '0x0' },
    });
    fireEvent.change(container.querySelector(`#${FORM_NAME}_description`), {
      target: { value: 'desc' },
    });
    fireEvent.change(container.querySelector(`#${FORM_NAME}_dependencies`), {
      target: { value: '1, 2' },
    });

    // submit
    fireEvent.submit(container.querySelector('.ant-btn[type="submit"]'));

    await waitFor(async () => {
      // screen.debug();
      expect(handleSubmit.mock.calls).toHaveLength(1);
    });
  });
});
