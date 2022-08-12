import { ethers } from 'ethers';

export const convertToEth = (value) => ethers.utils.formatEther(value);
