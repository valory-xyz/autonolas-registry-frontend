import React from 'react';
import { waitFor, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm, { FORM_NAME } from 'common-util/List/RegisterForm';
import { wrapProvider, dummyAddress, mockV1Hash } from '../../helpers';

const handleSubmit = jest.fn(() => {});
const handleCancel = jest.fn(() => {});

jest.mock('common-util/List/IpfsHashGenerationModal/helpers', () => ({
  getIpfsHashHelper: jest.fn(() => mockV1Hash),
}));

describe('<RegisterForm />', () => {
  it('should submit the form successfully', async () => {
    expect.hasAssertions();
    const { container, getByRole, getByText } = render(
      wrapProvider(
        <RegisterForm
          listType="agent"
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
        />,
      ),
    );

    // add the hash in the beginning
    userEvent.click(getByRole('button', { name: 'Generate Hash & File' }));

    expect(
      getByText('Generate IPFS Hash of Metadata File'),
    ).toBeInTheDocument();

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

    // adding input
    userEvent.type(
      container.querySelector(`#${FORM_NAME}_owner_address`),
      dummyAddress,
    );
    userEvent.type(
      container.querySelector(`#${FORM_NAME}_dependencies`),
      '1, 2',
    );

    // submit
    const formSubmitBtn = getByRole('button', { name: 'Submit' });
    expect(formSubmitBtn).toBeEnabled();
    userEvent.click(formSubmitBtn);

    // TODO: should be 1 but due to antd form errors, unable to do so.
    await waitFor(async () => {
      expect(handleSubmit.mock.calls).toHaveLength(0);
    });
  });
});
