import { getComponentContract } from 'common-util/Contracts';
import {
  getComponentDetails,
  getComponents,
  getFilteredComponents,
} from 'components/ListComponents/utils';
import { dummyAddress } from '../../helpers';

const COMPONENT_1 = { name: 'Component One' };

jest.mock('common-util/Contracts', () => ({
  getComponentContract: jest.fn(),
}));

describe('listComponents/utils.jsx', () => {
  it('getComponentDetails: Promise resolved', async () => {
    getComponentContract.mockImplementation(() => ({
      getUnit: jest.fn(() => Promise.resolve(COMPONENT_1)),
    }));

    const result = await getComponentDetails();
    expect(result).toMatchObject(COMPONENT_1);
  });

  it('getFilteredComponents: Promise resolved', async () => {
    getComponentContract.mockImplementation(() => ({
      totalSupply: jest.fn(() => Promise.resolve(1)),
      balanceOf: jest.fn(() => Promise.resolve(1)),
      getUnit: jest.fn(() => Promise.resolve(COMPONENT_1)),
      ownerOf: jest.fn(() => Promise.resolve(dummyAddress)),
    }));

    const result = await getFilteredComponents(dummyAddress);
    expect(result).toMatchObject([COMPONENT_1]);
  });

  it('getComponents: Promise resolved', async () => {
    getComponentContract.mockImplementation(() => ({
      totalSupply: jest.fn(() => Promise.resolve(1)),
      getUnit: jest.fn(() => Promise.resolve(COMPONENT_1)),
      ownerOf: jest.fn(() => Promise.resolve(dummyAddress)),
    }));

    const result = await getComponents(1, 1);
    expect(result).toMatchObject([COMPONENT_1]);
  });
});
