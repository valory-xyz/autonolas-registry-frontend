import React from 'react';
import { render } from '@testing-library/react';
import {
  convertStringToArray,
  ListEmptyMessage,
  AlertSuccess,
  AlertError,
} from 'common-util/List/ListCommon';

describe('convertStringToArray()', () => {
  it.each([
    { input: 'A, B, C', output: ['A', 'B', 'C'] },
    { input: '1, 2', output: ['1', '2'] },
    { input: 'Hello', output: ['Hello'] },
    { input: null, output: null },
    { input: undefined, output: undefined },
  ])('expects valid string (input=$input)', ({ input, output }) => {
    const result = convertStringToArray(input);
    expect(result).toStrictEqual(output);
  });
});

describe('<ListEmptyMessage />', () => {
  it.each([
    { input: 'agent', output: /No agents registered/ },
    { input: 'component', output: /No components registered/ },
    { input: 'service', output: /No services registered/ },
    { input: 'operator', output: /No operators registered/ },
    { input: null, output: /Please check type!/ },
  ])('expects valid type (input=$input)', ({ input, output }) => {
    expect.hasAssertions();
    const { getByText } = render(<ListEmptyMessage type={input} />);
    expect(getByText(output)).toBeInTheDocument();
  });
});

describe('<AlertSuccess />', () => {
  it.each([
    {
      type: 'Agent',
      input: { name: 'Valory' },
    },
    {
      type: null,
      input: { name: 'Valory' },
    },
  ])('expects valid object (input=$input)', ({ type, input }) => {
    expect.hasAssertions();
    const { getByText } = render(
      <AlertSuccess type={type} information={input} />,
    );
    // eslint-disable-next-line jest/no-conditional-in-test
    if (type) {
      expect(getByText(`${type} minted`)).toBeInTheDocument();
    } else {
      expect(getByText('Minted successfully')).toBeInTheDocument();
    }
  });

  it.each([{ input: null }, { input: undefined }])(
    'expects invalid object (input=$input)',
    ({ input }) => {
      expect.hasAssertions();
      const { queryByTestId } = render(<AlertSuccess information={input} />);
      expect(queryByTestId('alert-info-container')).not.toBeInTheDocument();
    },
  );
});

describe('<AlertError />', () => {
  it.each([
    { input: new Error('Exception occured'), output: /Exception occured/ },
  ])('expects valid error object (input=$input)', ({ input, output }) => {
    const { getByText, getByTestId } = render(<AlertError error={input} />);
    expect(getByText(output)).toBeInTheDocument();
    expect(getByTestId('alert-error-container')).toBeInTheDocument();
  });

  it.each([{ input: null }, { input: undefined }])(
    'expects invalid object (input=$input)',
    ({ input }) => {
      const { queryByTestId } = render(<AlertError error={input} />);
      expect(queryByTestId('alert-error-container')).not.toBeInTheDocument();
    },
  );
});
