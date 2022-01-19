import React from 'react';
import { render, waitFor } from '@testing-library/react';
import ListCards from 'common-util/List/ListCards';
import { wrapProvider } from '../../helpers';

const getEmptyList = () => Promise.resolve([]);
const getRejectedList = () => Promise.reject(new Error('Some error occured'));
const getList = () => Promise.resolve([{ number: 'One' }, { number: 'Two' }]);

describe('<ListCards />', () => {
  it('no account is passed', async () => {
    expect.hasAssertions();
    const { getByTestId } = render(
      wrapProvider(<ListCards type="agent" getList={getEmptyList} />, true),
    );

    await waitFor(() => {
      const element = getByTestId('not-registered-message');
      expect(element).toBeInTheDocument();
    });
  });

  it('account is passed with error list', async () => {
    expect.hasAssertions();
    const { getByTestId } = render(
      wrapProvider(<ListCards type="agent" getList={getRejectedList} />),
    );

    // Since it will throw an error on the console,
    // just mocking it not to print anything while testing.
    jest.spyOn(console, 'error').mockImplementationOnce(() => {});

    await waitFor(() => {
      const element = getByTestId('not-registered-message');
      expect(element).toBeInTheDocument();
    });
  });

  it('account is passed with empty list', async () => {
    expect.hasAssertions();
    const { queryByTestId } = render(
      wrapProvider(<ListCards type="agent" getList={getEmptyList} />),
    );

    await waitFor(() => {
      const element = queryByTestId('not-registered-message');
      expect(element).not.toBeInTheDocument();
    });
  });

  it('account is passed with list', async () => {
    expect.hasAssertions();
    const { queryByTestId, queryByText } = render(
      wrapProvider(<ListCards type="agent" getList={getList} />),
    );

    await waitFor(() => {
      const element = queryByTestId('not-registered-message');
      expect(element).not.toBeInTheDocument();
      expect(queryByText(/One/)).toBeInTheDocument();
      expect(queryByText(/Two/)).toBeInTheDocument();
    });
  });
});
