import React from 'react';
import { useRouter } from 'next/router';
import { render } from '@testing-library/react';
import ListOperators from 'components/ListOperators';
import Operator from 'components/ListOperators/operator';
import { wrapProvider } from '../../helpers';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

useRouter.mockImplementation(() => ({ push: jest.fn() }));

describe('listOperators/index.jsx', () => {
  it('should render `Mint` button', async () => {
    expect.hasAssertions();
    const { getByRole } = render(wrapProvider(<ListOperators />));

    expect(getByRole('button', { name: 'Mint' })).toBeInTheDocument();
  });
});

describe('listOperators/operator.jsx', () => {
  it('should render header as `Operator`', async () => {
    expect.hasAssertions();
    const { container } = render(wrapProvider(<Operator />));
    expect(container.querySelector('.ant-typography').textContent).toBe(
      'Operator',
    );
  });
});
