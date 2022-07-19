import { getServiceContract } from 'common-util/Contracts';
// import {
//   getBytes32FromIpfsHash,
//   convertStringToArray,
// } from 'common-util/List/ListCommon';

export const getServiceOwner = (id) => new Promise((resolve, reject) => {
  const contract = getServiceContract();

  contract.methods
    .ownerOf(id)
    .call()
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});
