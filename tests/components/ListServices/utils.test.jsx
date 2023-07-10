import { getServiceRegistryContract } from 'common-util/Contracts';
import {
  getServices,
  getFilteredServices,
} from 'components/ListServices/utils';
import { dummyAddress } from '../../helpers';

const SERVICE_1 = { name: 'Service One' };

jest.mock('common-util/Contracts', () => ({
  getServiceRegistryContract: jest.fn(),
}));

describe('listServices/utils.jsx', () => {
  it('getFilteredServices: Promise resolved', async () => {
    expect.hasAssertions();

    getServiceRegistryContract.mockImplementation(() => ({
      methods: {
        totalSupply: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(1)),
        })),
        exists: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve({ status: 'fulfilled', value: true })),
        })),
        balanceOf: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(1)),
        })),
        getService: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(SERVICE_1)),
        })),
        getServiceState: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve('0')),
        })),
        ownerOf: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(dummyAddress)),
        })),
      },
    }));

    const result = await getFilteredServices(dummyAddress);
    expect(result).toMatchObject([SERVICE_1]);
  });

  it('getServices: Promise resolved', async () => {
    expect.hasAssertions();

    getServiceRegistryContract.mockImplementation(() => ({
      methods: {
        totalSupply: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(1)),
        })),
        exists: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve({ status: 'fulfilled', value: true })),
        })),
        getService: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(SERVICE_1)),
        })),
        getServiceState: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve('0')),
        })),
        ownerOf: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(dummyAddress)),
        })),
      },
    }));

    const result = await getServices(1, 1);
    expect(result).toMatchObject([SERVICE_1]);
  });
});
