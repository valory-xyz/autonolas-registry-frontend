import React from 'react';
import { render, waitFor } from '@testing-library/react';
import IpfsHashGenerationModal from 'common-util/List/IpfsHashGenerationModal';
import { fillIpfsGenerationModal } from '../../../helpers/prefillForm';
import { wrapProvider, mockV1Hash } from '../../../helpers';

jest.mock('common-util/List/IpfsHashGenerationModal/helpers', () => ({
  getIpfsHashHelper: jest.fn(() => mockV1Hash),
}));

const callbackMock = jest.fn();
const handleCancelMock = jest.fn();

describe.skip('<IpfsHashGenerationModal />', () => {
  it('should render a hash generation modal and return Hash', async () => {
    expect.hasAssertions();
    const { getByText } = render(
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
    fillIpfsGenerationModal();

    await waitFor(() => {
      // callback should be called as expected with the dummy hash generated
      expect(callbackMock).toHaveBeenCalledTimes(1);
      expect(callbackMock).toHaveBeenCalledWith(mockV1Hash);

      // modal should be closed once the hash is generated
      expect(handleCancelMock).toHaveBeenCalledTimes(1);
    });
  });
});
