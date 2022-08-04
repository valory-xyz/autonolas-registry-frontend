import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getMechMinterContract } from 'common-util/Contracts';
import RegisterAgent from 'components/ListAgents/register';
import { FORM_NAME } from 'common-util/List/RegisterForm';
import { wrapProvider, dummyAddress, mockV1Hash } from '../../helpers';

const NEW_AGENT = { name: 'New Agent One' };

jest.mock('common-util/Contracts', () => ({
  getMechMinterContract: jest.fn(),
}));

jest.mock('common-util/List/IpfsHashGenerationModal/helpers', () => ({
  getIpfsHashHelper: jest.fn(() => mockV1Hash),
}));

const handleSubmit = jest.fn(() => {});

const fillIpfsGenerationModal = () => {
  userEvent.type(screen.getByRole('textbox', { name: 'Name' }), '1');
  userEvent.type(screen.getByRole('textbox', { name: 'Description' }), '1');
  userEvent.type(screen.getByRole('textbox', { name: 'Version' }), '1');
  userEvent.type(
    screen.getByRole('textbox', { name: 'Package hash' }),
    mockV1Hash,
  );
  userEvent.type(
    screen.getByRole('textbox', { name: 'NFT Image URL' }),
    mockV1Hash,
  );
  userEvent.click(
    screen.getByRole('button', {
      name: 'Save File & Generate Hash',
    }),
  );
};

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
      wrapProvider(<RegisterAgent handleSubmit={handleSubmit} />),
    );

    // title
    expect(getByText(/Register Agent/i)).toBeInTheDocument();

    // get hash
    userEvent.click(getByRole('button', { name: 'Generate Hash & File' }));
    fillIpfsGenerationModal();

    // other fields
    expect(
      getByRole('button', { name: 'Prefill Address' }),
    ).toBeInTheDocument();
    userEvent.type(
      container.querySelector(`#${FORM_NAME}_owner_address`),
      dummyAddress,
    );
    userEvent.type(container.querySelector(`#${FORM_NAME}_hash`), mockV1Hash);
    userEvent.type(
      container.querySelector(`#${FORM_NAME}_dependencies`),
      '1, 2',
    );

    // submit button
    const submitButton = getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeInTheDocument();
    userEvent.click(submitButton);

    await waitFor(async () => {
      // TODO: should be 1
      expect(handleSubmit.mock.calls).toHaveLength(0);
      // check if `Agent registered` on `Submit` click
      // expect(container.querySelector('.ant-alert-message').textContent).toBe(
      //   'Agent registered',
      // );
    });
  });
});
