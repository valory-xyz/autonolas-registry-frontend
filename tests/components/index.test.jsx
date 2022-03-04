import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Components from 'components/index';
import { wrapProvider, dummyAddress } from '../helpers';

describe('components/index.jsx', () => {
  it('should render metamask address', async () => {
    expect.hasAssertions();
    const { getByTestId } = render(wrapProvider(<Components />));
    await waitFor(async () => {
      const address = getByTestId('metamask-address').textContent;
      expect(address).toContain(dummyAddress);
    });
  });
});
