import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ListComponents from 'components/ListComponents';
import {
  getComponents,
  getFilteredComponents,
  getTotalForAllComponents,
  getTotalForMyComponents,
} from 'components/ListComponents/utils';
import { useRouter } from 'next/router';
import { wrapProvider, ACTIVE_TAB, getTableTd } from '../../helpers';

jest.mock('components/ListComponents/utils', () => ({
  getComponents: jest.fn(),
  getFilteredComponents: jest.fn(),
  getTotalForAllComponents: jest.fn(),
  getTotalForMyComponents: jest.fn(),
}));

// dummy responses mock
const allComponentResponse = { id: '1', dependencies: ['1'] };
const myComponentResponse = { id: '2', dependencies: ['2'] };

describe('listComponents/index.jsx', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockImplementation(() => ({ push: jest.fn() }));
    getComponents.mockResolvedValue([allComponentResponse]);
    getFilteredComponents.mockResolvedValue([myComponentResponse]);
    getTotalForAllComponents.mockResolvedValue(1);
    getTotalForMyComponents.mockResolvedValue(1);
  });

  it('should render tabs with `All Tab` as active tab & Mint button', async () => {
    expect.hasAssertions();

    const { container, getByRole } = render(wrapProvider(<ListComponents />));

    // check if the selected tab is `All` & has the correct content
    await waitFor(async () => expect(container.querySelector(ACTIVE_TAB).textContent).toBe('All'));

    await waitFor(async () => {
      // ckecking Id, description column
      expect(container.querySelector(getTableTd(1)).textContent).toBe('1');
      expect(container.querySelector(getTableTd(4)).textContent).toBe(
        allComponentResponse.dependencies.length.toString(),
      );

      // it should be called once
      // expect(useRouter).toHaveBeenCalledTimes(1);

      expect(getByRole('button', { name: 'Mint' })).toBeInTheDocument();
    });
  });

  it('should render tabs with `My Components` as active tab & Mint button', async () => {
    expect.hasAssertions();

    const { container, getByRole } = render(wrapProvider(<ListComponents />));

    // click the `My components` tab
    userEvent.click(container.querySelector('.ant-tabs-tab:nth-child(2)'));

    // check if the selected tab is `My components` & has the correct content
    await waitFor(async () => expect(container.querySelector(ACTIVE_TAB).textContent).toBe(
      'My Components',
    ));

    // Mint button
    expect(getByRole('button', { name: 'Mint' })).toBeInTheDocument();
  });
});
