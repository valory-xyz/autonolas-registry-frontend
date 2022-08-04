import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IpfsHashGenerationModal from 'common-util/List/IpfsHashGenerationModal';
import { wrapProvider, mockV1Hash } from '../../../helpers';

jest.mock('common-util/List/IpfsHashGenerationModal/helpers', () => ({
  getIpfsHashHelper: jest.fn(
    () => '6f3212908f2e7a0249b67b05f237a40b76b7d8ef36d5620b281ceb47dcb6b122',
  ),
}));


const callbackMock = jest.fn();
const handleCancelMock = jest.fn();

describe('<IpfsHashGenerationModal />', () => {
  it('should render a hash generation modal and return Hash', async () => {
    expect.hasAssertions();
    const { getByText, getByRole } = render(
      wrapProvider(
        <IpfsHashGenerationModal
          visible
          type="agent"
          callback={callbackMock}
          handleCancel={handleCancelMock}
        />,
        true,
      ),
    );

    expect(
      getByText('Generate IPFS Hash of Metadata File'),
    ).toBeInTheDocument();

    userEvent.type(getByRole('textbox', { name: 'Name' }), '1');
    userEvent.type(getByRole('textbox', { name: 'Description' }), '2');
    userEvent.type(getByRole('textbox', { name: 'Version' }), '3');
    userEvent.type(
      getByRole('textbox', { name: 'Package hash' }),
      mockV1Hash,
    );
    userEvent.type(
      getByRole('textbox', { name: 'NFT Image URL' }),
      mockV1Hash,
    );
    userEvent.click(
      getByRole('button', {
        name: 'Save File & Generate Hash',
      }),
    );

    await waitFor(() => {
      // callback should be called as expected with the dummy hash generated
      expect(callbackMock).toHaveBeenCalledTimes(1);
      expect(callbackMock).toHaveBeenCalledWith(mockV1Hash);

      // modal should be closed once the hash is generated
      expect(handleCancelMock).toHaveBeenCalledTimes(1);
    });
  });
});
