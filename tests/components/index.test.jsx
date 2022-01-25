import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Components from 'components/index';
import { wrapProvider, dummyAddress } from '../helpers';

describe('<Components /> index.jsx', () => {
  it('works as expected', async () => {
    expect.hasAssertions();
    const { getByTestId } = render(wrapProvider(<Components />));
    const address = getByTestId('metamask-address').textContent;
    await waitFor(async () => {
      expect(address).toContain(dummyAddress);
    });
  });
});
