/* eslint-disable jest/require-hook */
import '@testing-library/jest-dom/jest-globals';

// https:// jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

jest.mock('ipfs-only-hash', () => ({
  of: jest.fn(),
}));

jest.mock('common-util/Login', () => ({
  SUPPORTED_CHAINS: [{ id: 1 }],
}));

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));
