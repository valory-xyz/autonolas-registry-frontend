import {
  getOperatorWhitelistContract,
  getServiceRegistryTokenUtilityContract,
} from '../Contracts';
import { sendTransaction } from '../functions';

export const getTokenDetailsRequest = async (serviceId) => {
  const contract = getServiceRegistryTokenUtilityContract();
  const deposit = await contract.methods
    .mapServiceIdTokenDeposit(serviceId)
    .call();
  return deposit;
};

/* ----- operator whitelist functions ----- */
export const checkIfServiceRequiresWhitelisting = async (serviceId) => {
  const contract = getOperatorWhitelistContract();
  // if true: it is whitelisted by default
  // else we can whitelist using the input field
  const response = await contract.methods
    .mapServiceIdOperatorsCheck(serviceId)
    .call();
  return response;
};

export const checkIfServiceIsWhitelisted = async (
  serviceId,
  operatorAddress,
) => {
  const contract = getOperatorWhitelistContract();
  const response = await contract.methods
    .isOperatorWhitelisted(serviceId, operatorAddress)
    .call();
  return response;
};

export const setOperatorsCheckRequest = async ({
  account,
  serviceId,
  isChecked,
}) => {
  const contract = getOperatorWhitelistContract();
  const fn = contract.methods
    .setOperatorsCheck(serviceId, isChecked)
    .send({ from: account });
  const response = await sendTransaction(fn, account);
  return response;
};

export const setOperatorsStatusesRequest = async ({
  account,
  serviceId,
  operatorAddresses,
  operatorStatuses,
}) => {
  const contract = getOperatorWhitelistContract();
  const fn = contract.methods
    .setOperatorsStatuses(serviceId, operatorAddresses, operatorStatuses, true)
    .send({ from: account });
  const response = await sendTransaction(fn, account);
  return response;
};
