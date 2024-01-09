import { ALL_SUPPORTED_CHAINS, EVM_SUPPORTED_CHAINS } from 'common-util/Login/config';
import { VM_TYPE } from 'util/constants';
import { apiTypes, syncTypes } from './_types';

const initialState = {
  account: null,
  balance: null,
  vmType: null,
  errorMessage: null,

  // chain info
  chainId: null,
  chainDisplayName: null,
  chainName: null,
};

const setup = (state = initialState, { data, type } = {}) => {
  switch (type) {
    case apiTypes.GET_API: {
      return { ...state, data };
    }

    case syncTypes.SET_ACCOUNT:
    case syncTypes.SET_BALANCE:
    case syncTypes.SET_LOGIN_ERROR:
    case syncTypes.SET_STORE_STATE: {
      return { ...state, ...data };
    }
    case syncTypes.SET_VM_INFO: {
      const info = ALL_SUPPORTED_CHAINS.find(
        (item) => item.networkName === data.networkName,
      );

      if (info.vmType === VM_TYPE.SVM) {
        return {
          ...state,
          vmType: VM_TYPE.SVM,
          chainDisplayName: info.networkDisplayName,
          chainName: info.networkName,
        };
      }

      return {
        ...state,
        vmType: VM_TYPE.EVM,
      };
    }

    case syncTypes.SET_CHAIND_ID: {
      const networkInfo = EVM_SUPPORTED_CHAINS.find(
        (item) => item.id === data.chainId,
      );
      return {
        ...state,
        ...data,
        chainDisplayName: networkInfo?.networkDisplayName || null,
        chainName: networkInfo?.networkName || null,
      };
    }

    case syncTypes.SET_LOGOUT: {
      return {
        ...state,
        account: null,
        balance: null,
        errorMessage: null,
        isVerified: false,
      };
    }

    default:
      return state;
  }
};

export default setup;
