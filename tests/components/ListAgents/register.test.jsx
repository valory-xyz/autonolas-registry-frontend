import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getMechMinterContract } from 'common-util/Contracts';
import RegisterAgent from 'components/ListAgents/register';
import { FORM_NAME } from 'common-util/List/RegisterForm';
import { wrapProvider, dummyAddress, dummyHash } from '../../helpers';

const NEW_AGENT = { name: 'New Agent One' };

jest.mock('common-util/Contracts', () => ({
  getMechMinterContract: jest.fn(),
}));

describe('listAgents/register.jsx', () => {
  it('should submit the form & register the `Agent` successfully', async () => {
    expect.hasAssertions();

    getMechMinterContract.mockImplementation(() => ({
      methods: {
        create: jest.fn(() => ({
          send: jest.fn(() => Promise.resolve(NEW_AGENT)),
        })),
      },
    }));

    const { container, getByRole, getByText } = render(
      wrapProvider(<RegisterAgent />),
    );

    // title
    expect(getByText(/Register Agent/i)).toBeInTheDocument();

    expect(
      getByRole('button', { name: 'Prefill Address' }),
    ).toBeInTheDocument();
    userEvent.type(
      container.querySelector(`#${FORM_NAME}_owner_address`),
      dummyAddress,
    );
    userEvent.type(container.querySelector(`#${FORM_NAME}_hash`), dummyHash);
    expect(getByRole('button', { name: 'Generate Hash' })).toBeInTheDocument();
    userEvent.type(
      container.querySelector(`#${FORM_NAME}_dependencies`),
      '1, 2',
    );

    // submit button
    const submitButton = getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeInTheDocument();
    userEvent.click(submitButton);

    await waitFor(async () => {
      // check if `Agent registered` on `Submit` click
      expect(getByText(/Agent registered/i)).toBeInTheDocument();

      // Newly agent info should also be displayed in AlertInfo
      expect(getByText(/New Agent One/i)).toBeInTheDocument();
    });
  });
});
