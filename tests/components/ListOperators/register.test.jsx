import React from 'react';
import { useRouter } from 'next/router';
import { render, fireEvent } from '@testing-library/react';
import RegisterOperator from 'components/ListOperators/register';
import { wrapProvider } from '../../helpers';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

useRouter.mockImplementation(() => ({ push: jest.fn() }));

describe('<ListOperators /> register.jsx', () => {
  it('works as expected', async () => {
    expect.hasAssertions();
    const { container } = render(wrapProvider(<RegisterOperator />));
    expect(container.querySelector('.ant-typography').textContent).toBe(
      'Register Operator',
    );

    fireEvent.click(container.querySelector('.ant-btn'));
  });
});
