import { getComponentContract } from 'common-util/Contracts';
import { getComponents, getComponentsByAccount } from 'components/ListComponents/utils';

const COMPONENT_1 = { name: 'Component One' };

jest.mock('common-util/Contracts', () => ({
  getComponentContract: jest.fn(),
}));

describe('<ListComponents /> utils.jsx', () => {
  it('getComponentsByAccount: Promise resolved', async () => {
    expect.hasAssertions();

    getComponentContract.mockImplementation(() => ({
      methods: {
        balanceOf: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(1)),
        })),
        getComponentInfo: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(COMPONENT_1)),
        })),
      },
    }));

    const result = await getComponentsByAccount();
    expect(result).toMatchObject([COMPONENT_1]);
  });

  it('getComponentsByAccount: Promise rejected', async () => {
    expect.hasAssertions();

    getComponentContract.mockImplementation(() => ({
      methods: {
        balanceOf: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(1)),
        })),
        getComponentInfo: jest.fn(() => ({
          call: jest.fn(() => new Error('Bad Request')),
        })),
      },
    }));

    const result = await getComponentsByAccount();
    expect(result).toMatchObject([Error('Bad Request')]);
  });

  it('getComponents: Promise resolved', async () => {
    expect.hasAssertions();

    getComponentContract.mockImplementation(() => ({
      methods: {
        totalSupply: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(1)),
        })),
        getComponentInfo: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(COMPONENT_1)),
        })),
      },
    }));

    const result = await getComponents();
    expect(result).toMatchObject([COMPONENT_1]);
  });

  it('getComponents: Promise rejected', async () => {
    expect.hasAssertions();

    getComponentContract.mockImplementation(() => ({
      methods: {
        totalSupply: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(1)),
        })),
        getComponentInfo: jest.fn(() => ({
          call: jest.fn(() => new Error('Bad Request')),
        })),
      },
    }));

    const result = await getComponents();
    expect(result).toMatchObject([Error('Bad Request')]);
  });
});
