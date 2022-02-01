import { getServiceContract } from 'common-util/Contracts';
import {
  getServices,
  getServicesByAccount,
} from 'components/ListServices/utils';

const SERVICE_1 = { name: 'Service One' };

jest.mock('common-util/Contracts', () => ({
  getServiceContract: jest.fn(),
}));

describe('listServices/utils.jsx', () => {
  it('getServicesByAccount: Promise resolved', async () => {
    expect.hasAssertions();

    getServiceContract.mockImplementation(() => ({
      methods: {
        balanceOf: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(1)),
        })),
        getServiceInfo: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(SERVICE_1)),
        })),
      },
    }));

    const result = await getServicesByAccount();
    expect(result).toMatchObject([SERVICE_1]);
  });

  it('getServicesByAccount: Promise rejected', async () => {
    expect.hasAssertions();

    getServiceContract.mockImplementation(() => ({
      methods: {
        balanceOf: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(1)),
        })),
        getServiceInfo: jest.fn(() => ({
          call: jest.fn(() => new Error('Bad Request')),
        })),
      },
    }));

    const result = await getServicesByAccount();
    expect(result).toMatchObject([Error('Bad Request')]);
  });

  it('getServices: Promise resolved', async () => {
    expect.hasAssertions();

    getServiceContract.mockImplementation(() => ({
      methods: {
        totalSupply: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve({ maxServiceId: 1 })),
        })),
        exists: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve({ status: 'fulfilled', value: true })),
        })),
        getServiceInfo: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(SERVICE_1)),
        })),
      },
    }));

    const result = await getServices();
    expect(result).toMatchObject([SERVICE_1]);
  });
});
