import React from 'react';
import { useRouter } from 'next/router';
import {
  render, fireEvent, waitFor,
} from '@testing-library/react';
import Layout from 'components/Layout';
import { wrapProvider } from '../../helpers';

const PATHNAME = 'agents';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const push = jest.fn();

useRouter.mockImplementation(() => ({ push, pathname: PATHNAME }));

describe('<Layout /> index.jsx', () => {
  it('works as expected', async () => {
    expect.hasAssertions();
    const { container, getByTestId } = render(wrapProvider(<Layout />));
    const logo = getByTestId('protocol-logo');
    const menuItems = container.querySelectorAll(
      '.ant-menu-item .ant-menu-title-content',
    );
    const footer = container.querySelector('.ant-layout-footer');

    await waitFor(async () => {
      expect(menuItems[0].textContent).toBe('Components');
      expect(menuItems[1].textContent).toBe('Agents');
      expect(menuItems[2].textContent).toBe('Services');
      expect(menuItems[3].textContent).toBe('Operators');

      // click on menu-item
      fireEvent.click(menuItems[1]);

      // once clicked, it should be called with specified pathname
      expect(push).toHaveBeenCalledWith(`/${PATHNAME}`);

      // header logo
      expect(logo.textContent).toContain('Registry');
      fireEvent.click(logo);
      expect(push).toHaveBeenCalledWith('/');

      // check if footer contains `Valory`
      expect(footer.textContent).toContain('Valory');
    });
  });
});
