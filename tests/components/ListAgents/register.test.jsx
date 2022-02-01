import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getMechMinterContract } from 'common-util/Contracts';
import RegisterAgent from 'components/ListAgents/register';
import { FORM_NAME } from 'common-util/List/RegisterForm';
import { wrapProvider, dummyAddress } from '../../helpers';

const NEW_AGENT = { name: 'New Agent One' };

jest.mock('common-util/Contracts', () => ({
  getMechMinterContract: jest.fn(),
}));

describe('listAgents/register.jsx', () => {
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

    userEvent.click(container.querySelector('.ant-btn[type="submit"]'));

    await waitFor(async () => {
      // check if `Agent registered` on `Submit` click
      expect(getByText(/Agent registered/i)).toBeInTheDocument();

      // Newly agent info should also be displayed in AlertInfo
      expect(getByText(/New Agent One/i)).toBeInTheDocument();
    });
  });
});
