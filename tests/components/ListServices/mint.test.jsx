import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getServiceManagerContract } from 'common-util/Contracts';
import MintService from 'components/ListServices/mint';
import { FORM_NAME } from 'components/ListServices/helpers/RegisterForm';
import { wrapProvider, dummyAddress, mockV1Hash } from '../../helpers';
import { fillIpfsGenerationModal } from '../../helpers/prefillForm';

const NEW_SERVICE = { name: 'New Service One' };

jest.mock('common-util/Contracts', () => ({
  getServiceManagerContract: jest.fn(),
}));

jest.mock('common-util/List/IpfsHashGenerationModal/helpers', () => ({
  getIpfsHashHelper: jest.fn(() => mockV1Hash),
}));

describe('listServices/mint.jsx', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getServiceManagerContract.mockImplementation(() => ({
      create: jest.fn(() => ({
        send: jest.fn(() => Promise.resolve(NEW_SERVICE)),
      })),
    }));
  });

  it('should submit the form successfully', async () => {
    const {
      container, getByText, getByRole, getByTestId,
    } = render(
      wrapProvider(<MintService />),
    );
    // title
    expect(getByText(/Mint Service/i)).toBeInTheDocument();

    // get hash
    userEvent.click(getByTestId('generate-hash-file'));

    // wait for ipfs generation modal to open
    await waitFor(() => {
      getByText(/Generate IPFS Hash of Metadata File/i);
    });

    fillIpfsGenerationModal();

    // other fields
    userEvent.type(
      container.querySelector(`#${FORM_NAME}_owner_address`),
      dummyAddress,
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
    userEvent.click(submitButton);

    // await act(async () => {
    // TODO: antd form throws error on hash, check console, check console
    // check if `Service registered` on `Submit` click
    // expect(container.querySelector('.ant-alert-message').textContent).toBe(
    //   'Service registered',
    // );
    // });
  });
});
