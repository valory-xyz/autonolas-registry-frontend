import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { getMechMinterContract } from 'common-util/Contracts';
import RegisterAgent from 'components/ListAgents/register';
import { FORM_NAME } from 'common-util/List/RegisterForm';
import { wrapProvider, dummyAddress } from '../../helpers';

const NEW_AGENT = { name: 'New Agent One' };

jest.mock('common-util/Contracts', () => ({
  getMechMinterContract: jest.fn(),
}));

describe('<ListAgents /> register.jsx', () => {
  it('works as expected', async () => {
    expect.hasAssertions();

    getMechMinterContract.mockImplementation(() => ({
      methods: {
        mintAgent: jest.fn(() => ({
          send: jest.fn(() => Promise.resolve(NEW_AGENT)),
        })),
      },
    }));

    const { container, getByText } = render(wrapProvider(<RegisterAgent />));

    // title
    expect(getByText(/Register Agent/i)).toBeInTheDocument();

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
      // check if `Agent registered` on `Submit` click
      expect(getByText(/Agent registered/i)).toBeInTheDocument();

      // Newly agent info should also be displayed in AlertInfo
      expect(getByText(/New Agent One/i)).toBeInTheDocument();
    });
  });
});
