import React from 'react';
import { render } from '@testing-library/react';
import Login from 'components/Login';

describe('<Login />', () => {
  it('works', () => {
    expect.hasAssertions();
    const { getByTestId } = render(<Login />);
    const element = getByTestId('login');
    expect(element).toBeInTheDocument();
  });
});
