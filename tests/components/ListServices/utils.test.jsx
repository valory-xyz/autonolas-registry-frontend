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
        getService: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(SERVICE_1)),
        })),
        getServiceState: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve('0')),
        })),
      },
    }));

    const result = await getServicesByAccount();
    expect(result).toMatchObject([SERVICE_1]);
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
        getService: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(SERVICE_1)),
        })),
        getServiceState: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve('0')),
        })),
      },
    }));

    const result = await getServices();
    expect(result).toMatchObject([SERVICE_1]);
  });
});
