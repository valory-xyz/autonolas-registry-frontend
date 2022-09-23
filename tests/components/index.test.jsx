import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Components from 'components/index';
import { getTrimmedText } from 'common-util/List/ListTable/helpers';
import { wrapProvider, dummyAddress } from '../helpers';

describe('components/index.jsx', () => {
  it('should render wallet address', async () => {
    expect.hasAssertions();
    const { getByTestId } = render(wrapProvider(<Components />));
    const address = getByTestId('wallet-address').textContent;
    await waitFor(async () => {
      expect(address).toBe(getTrimmedText(dummyAddress, 6));
    });
  });
});
