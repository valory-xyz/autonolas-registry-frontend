import React from 'react';
import { useRouter } from 'next/router';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Layout from 'components/Layout';
import { wrapProvider } from '../../helpers';

const PATHNAME = 'agents';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const push = jest.fn();

useRouter.mockImplementation(() => ({ push, pathname: PATHNAME }));

describe('layout/index.jsx', () => {
  it('should render logo & navbar', async () => {
    expect.hasAssertions();
    const { container, getByTestId } = render(wrapProvider(<Layout />));
    // TODO change it `getByRole` as `img` tag
    const logo = getByTestId('protocol-logo');
    const menuItems = container.querySelectorAll(
      '.ant-menu-item .ant-menu-title-content',
    );

    await waitFor(async () => {
      // header logo
      expect(logo.textContent).toContain('Registry');

      // menu items
      expect(menuItems[0].textContent).toBe('Components');
      expect(menuItems[1].textContent).toBe('Agents');
      expect(menuItems[2].textContent).toBe('Services');
    });
  });

  it('logo & navbar should be navigable', async () => {
    expect.hasAssertions();
    const { container, getByTestId } = render(wrapProvider(<Layout />));
    const logo = getByTestId('protocol-logo');
    const agentMenuItem = container.querySelectorAll(
      '.ant-menu-item .ant-menu-title-content',
    )[1];

    await waitFor(async () => {
      // click on menu-item & once clicked, it should be called with specified pathname
      userEvent.click(agentMenuItem);
      expect(push).toHaveBeenCalledWith(`/${PATHNAME}`);

      userEvent.click(logo);
      expect(push).toHaveBeenCalledWith('/');
    });
  });

  it('should render footer', async () => {
    expect.hasAssertions();
    const { container } = render(wrapProvider(<Layout />));
    const footer = container.querySelector('.footer');
    await waitFor(async () => {
      expect(footer.textContent).toContain('Valory');
    });
  });
});
