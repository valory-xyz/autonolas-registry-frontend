import { getAgentContract } from 'common-util/Contracts';
import { getAgents, getAgentsByAccount } from 'components/ListAgents/utils';

const AGENT_1 = { name: 'Agent One' };

jest.mock('common-util/Contracts', () => ({
  getAgentContract: jest.fn(),
}));

describe('listAgents/utils.jsx', () => {
  it('getAgentsByAccount: Promise resolved', async () => {
    expect.hasAssertions();

    getAgentContract.mockImplementation(() => ({
      methods: {
        balanceOf: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(1)),
        })),
        getAgentInfo: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(AGENT_1)),
        })),
      },
    }));

    const result = await getAgentsByAccount();
    expect(result).toMatchObject([AGENT_1]);
  });

  it('getAgentsByAccount: Promise rejected', async () => {
    expect.hasAssertions();

    getAgentContract.mockImplementation(() => ({
      methods: {
        balanceOf: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(1)),
        })),
        getAgentInfo: jest.fn(() => ({
          call: jest.fn(() => new Error('Bad Request')),
        })),
      },
    }));

    const result = await getAgentsByAccount();
    expect(result).toMatchObject([Error('Bad Request')]);
  });

  it('getAgents: Promise resolved', async () => {
    expect.hasAssertions();

    getAgentContract.mockImplementation(() => ({
      methods: {
        totalSupply: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(1)),
        })),
        getAgentInfo: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(AGENT_1)),
        })),
      },
    }));

    const result = await getAgents();
    expect(result).toMatchObject([AGENT_1]);
  });

  it('getAgents: Promise rejected', async () => {
    expect.hasAssertions();

    getAgentContract.mockImplementation(() => ({
      methods: {
        totalSupply: jest.fn(() => ({
          call: jest.fn(() => Promise.resolve(1)),
        })),
        getAgentInfo: jest.fn(() => ({
          call: jest.fn(() => new Error('Bad Request')),
        })),
      },
    }));

    const result = await getAgents();
    expect(result).toMatchObject([Error('Bad Request')]);
  });
});
