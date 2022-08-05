import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockV1Hash } from './index';

export const fillIpfsGenerationModal = () => {
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
