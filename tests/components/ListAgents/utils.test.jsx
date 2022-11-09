import { getAgentContract } from 'common-util/Contracts';
import { getAgents, getAgentsByAccount } from 'components/ListAgents/utils';
import { dummyAddress } from '../../helpers';

const AGENT_1 = { name: 'Agent One' };

jest.mock('common-util/Contracts', () => ({
  getAgentContract: jest.fn(),
}));

describe('listAgents/utils.jsx', () => {
  it('getAgentsByAccount: Promise resolved', async () => {
    expect.hasAssertions();

    getAgentContract.mockImplementation(() => ({
      methods: {
        totalSupply: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(1)),
        })),
        balanceOf: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(1)),
        })),
        getUnit: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(AGENT_1)),
        })),
        ownerOf: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(dummyAddress)),
        })),
      },
    }));

    const result = await getAgentsByAccount(dummyAddress);
    expect(result).toMatchObject([AGENT_1]);
  });

  it('getAgents: Promise resolved', async () => {
    expect.hasAssertions();

    getAgentContract.mockImplementation(() => ({
      methods: {
        totalSupply: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(1)),
        })),
        getUnit: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(AGENT_1)),
        })),
        ownerOf: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(dummyAddress)),
        })),
      },
    }));

    const result = await getAgents(1, 1);
    expect(result).toMatchObject([AGENT_1]);
  });
});
