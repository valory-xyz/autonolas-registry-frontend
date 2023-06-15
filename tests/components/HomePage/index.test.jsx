import React from 'react';
import { render } from '@testing-library/react';
import HomePage from 'components/HomePage';
import { useRouter } from 'next/router';
import { wrapProvider } from '../../helpers';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

describe('<HomePage>', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockImplementation(() => ({ push: jest.fn() }));
  });

  it('should render homepage', async () => {
    expect.hasAssertions();
    const { container } = render(wrapProvider(<HomePage />));
    expect(container).toMatchSnapshot();
  });
});
