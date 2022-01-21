import React from 'react';
import { useRouter } from 'next/router';
import { render, fireEvent } from '@testing-library/react';
import ListOperators from 'components/ListOperators';
import Operator from 'components/ListOperators/operator';
import { wrapProvider } from '../../helpers';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

useRouter.mockImplementation(() => ({ push: jest.fn() }));

describe('<ListOperators /> index.jsx', () => {
  it('works as expected', async () => {
    expect.hasAssertions();
    const { container } = render(wrapProvider(<ListOperators />));
    expect(container.querySelector('.ant-typography').textContent).toBe(
      'Operators',
    );
    expect(container.querySelector('.ant-btn')).toBeInTheDocument();

    fireEvent.click(container.querySelector('.ant-btn'));
  });
});

describe('<ListOperators /> operator.jsx', () => {
  it('works as expected', async () => {
    expect.hasAssertions();
    const { container } = render(wrapProvider(<Operator />));
    expect(container.querySelector('.ant-typography').textContent).toBe(
      'Operator',
    );
  });
});
