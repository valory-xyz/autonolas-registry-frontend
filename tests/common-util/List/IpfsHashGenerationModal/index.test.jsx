import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IpfsHashGenerationModal from 'common-util/List/IpfsHashGenerationModal';
import { wrapProvider, dummyV1Hash } from '../../../helpers';

const callbackMock = jest.fn();
const handleCancelMock = jest.fn();

describe('<IpfsHashGenerationModal />', () => {
  it('should render a not-registered message if no account is passed', async () => {
    expect.hasAssertions();
    const { getByTestId, getByText } = render(
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

    userEvent.type(screen.getByRole('textbox', { name: 'Name' }), '1');
    userEvent.type(screen.getByRole('textbox', { name: 'Description' }), '2');
    userEvent.type(screen.getByRole('textbox', { name: 'Version' }), '3');
    userEvent.type(
      screen.getByRole('textbox', { name: 'Package hash' }),
      dummyV1Hash,
    );
    userEvent.type(
      screen.getByRole('textbox', { name: 'NFT Image URL' }),
      dummyV1Hash,
    );
    userEvent.click(
      screen.getByRole('button', {
        name: 'Save File & Generate Hash',
      }),
    );

    await waitFor(() => {
      // callback should be called as expected with the dummy hash generated
      expect(callbackMock).toHaveBeenCalledTimes(1);
      expect(callbackMock).toHaveBeenCalledWith(dummyV1Hash);

      // modal should be closed once the hash is generated
      expect(handleCancelMock).toHaveBeenCalledTimes(1);
    });
  });
});
