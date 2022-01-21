import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { getMechMinterContract } from 'common-util/Contracts';
import RegisterComponent from 'components/ListComponents/register';
import { FORM_NAME } from 'common-util/List/RegisterForm';
import { wrapProvider, dummyAddress } from '../../helpers';

const NEW_COMPONENT = { name: 'New Component One' };

jest.mock('common-util/Contracts', () => ({
  getMechMinterContract: jest.fn(),
}));

describe('<ListComponents /> register.jsx', () => {
  it('works as expected', async () => {
    expect.hasAssertions();

    getMechMinterContract.mockImplementation(() => ({
      methods: {
        mintComponent: jest.fn(() => ({
          send: jest.fn(() => Promise.resolve(NEW_COMPONENT)),
        })),
      },
    }));

    const { container, getByText } = render(wrapProvider(<RegisterComponent />));

    // title
    expect(getByText(/Register Component/i)).toBeInTheDocument();

    // check if submit button is present
    expect(container.querySelector('.ant-btn[type="submit"]')).toBeTruthy();

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

    fireEvent.submit(container.querySelector('.ant-btn[type="submit"]'));

    await waitFor(async () => {
      // check if `Component registered` on `Submit` click
      expect(getByText(/Component registered/i)).toBeInTheDocument();

      // Newly component info should also be displayed in AlertInfo
      expect(getByText(/New Component One/i)).toBeInTheDocument();
    });
  });
});
