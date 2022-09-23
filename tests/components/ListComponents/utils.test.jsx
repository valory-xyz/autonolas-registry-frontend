import { getComponentContract } from 'common-util/Contracts';
import {
  getComponentDetails,
  getComponents,
  getComponentsByAccount,
} from 'components/ListComponents/utils';
import { dummyAddress } from '../../helpers';

const COMPONENT_1 = { name: 'Component One' };

jest.mock('common-util/Contracts', () => ({
  getComponentContract: jest.fn(),
}));

describe('listComponents/utils.jsx', () => {
  it('getComponentDetails: Promise resolved', async () => {
    expect.hasAssertions();

    getComponentContract.mockImplementation(() => ({
      methods: {
        getUnit: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(COMPONENT_1)),
        })),
      },
    }));

    const result = await getComponentDetails();
    expect(result).toMatchObject(COMPONENT_1);
  });

  it('getComponentsByAccount: Promise resolved', async () => {
    expect.hasAssertions();

    getComponentContract.mockImplementation(() => ({
      methods: {
        balanceOf: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(1)),
        })),
        getUnit: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(COMPONENT_1)),
        })),
        ownerOf: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(dummyAddress)),
        })),
      },
    }));

    const result = await getComponentsByAccount(1, 1);
    expect(result).toMatchObject([COMPONENT_1]);
  });

  it('getComponents: Promise resolved', async () => {
    expect.hasAssertions();

    getComponentContract.mockImplementation(() => ({
      methods: {
        totalSupply: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(1)),
        })),
        getUnit: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(COMPONENT_1)),
        })),
        ownerOf: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(dummyAddress)),
        })),
      },
    }));

    const result = await getComponents(1, 1);
    expect(result).toMatchObject([COMPONENT_1]);
  });
});
