import React from 'react';
// import { render } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import {
  getMappedArrayFromString,
  ListEmptyMessage,
  PrintJson,
  AlertInfo,
  AlertError,
} from 'common-util/List/ListCommon';

describe('getMappedArrayFromString()', () => {
  it.each([
    { input: 'A, B, C', output: ['A', 'B', 'C'] },
    { input: '1, 2', output: ['1', '2'] },
    { input: 'Hello', output: ['Hello'] },
    { input: null, output: null },
    { input: undefined, output: undefined },
  ])('example $input', ({ input, output }) => {
    const result = getMappedArrayFromString(input);
    expect(result).toStrictEqual(output);
  });
});

describe('<ListEmptyMessage />', () => {
  it.each([
    { input: 'agent', output: /No agents registered./ },
    { input: 'component', output: /No components registered./ },
    { input: 'service', output: /No services registered./ },
    { input: 'operator', output: /No operators registered./ },
    { input: null, output: /Please check type!/ },
  ])('example $input', ({ input, output }) => {
    expect.hasAssertions();
    const { getByText } = render(<ListEmptyMessage type={input} />);
    expect(getByText(output)).toBeInTheDocument();
  });
});

describe('<PrintJson />', () => {
  it.each([
    { input: { name: 'Valory' }, output: /"name": "Valory"/ },
    { input: {}, output: /{}/ },
  ])('example $input', ({ input, output }) => {
    expect.hasAssertions();
    const { getByText } = render(<PrintJson value={input} />);
    expect(getByText(output)).toBeInTheDocument();
  });
});

describe('<AlertInfo />', () => {
  it.each([
    {
      type: 'Agent Registered',
      input: { name: 'Valory' },
      output: /"name": "Valory"/,
    },
  ])('example $input', ({ type, input, output }) => {
    expect.hasAssertions();
    const { getByText, getByTestId } = render(<AlertInfo type={type} information={input} />);
    expect(getByText(output)).toBeInTheDocument();
    expect(getByText(`${type} successfully!`)).toBeInTheDocument();
    expect(getByTestId('alert-info-container')).toBeInTheDocument();
  });

  it.each([
    { input: null },
    { input: undefined },
  ])('example $input', ({ input }) => {
    const { queryByTestId } = render(<AlertInfo information={input} />);
    expect(queryByTestId('alert-info-container')).not.toBeInTheDocument();
  });
});

describe('<AlertError />', () => {
  it.each([
    { input: { stack: 'Exception occured' }, output: /Exception occured/ },
  ])('example $input', ({ input, output }) => {
    const { getByText, getByTestId } = render(<AlertError error={input} />);
    screen.debug();
    expect(getByText(output)).toBeInTheDocument();
    expect(getByTestId('alert-error-container')).toBeInTheDocument();
  });

  it.each([
    { input: null },
    { input: undefined },
  ])('example $input', ({ input }) => {
    const { queryByTestId } = render(<AlertError error={input} />);
    expect(queryByTestId('alert-error-container')).not.toBeInTheDocument();
  });
});
