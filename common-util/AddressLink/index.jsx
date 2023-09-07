/* eslint-disable react/prop-types */
import React from 'react';
import { Tooltip } from 'antd/lib';
import { GATEWAY_URL } from '@autonolas/frontend-library';
import { getChainId } from 'common-util/functions';

// *******************************************************
// ***** MOVE EVERYTHING BELOW TO AUTONOLAS LIBRARY ******
// *******************************************************

export const getExplorerURL = (chainId = 1) => {
  switch (chainId) {
    case 5:
      return 'https://goerli.etherscan.io';
    case 137:
      return 'https://polygonscan.com';
    case 80001:
      return 'https://mumbai.polygonscan.com';
    case 100:
      return 'https://gnosisscan.io';
    case 10200:
      return 'https://gnosis.blockscout.com';
    default:
      return 'https://etherscan.io';
  }
};

/**
 * function to get the trimmed text
 * @example
 * input: '0x02c26437b292d86c5f4f21bbcce0771948274f84', 6
 * output: '0x02c264...8274f84'
 */
export const getTrimmedText = (str, suffixCount) => {
  const text = str.trim();
  const frontText = text.slice(0, suffixCount);
  const backText = text.slice(text.length - suffixCount, text.length);
  return `${frontText}...${backText}`;
};

/**
 * returns the text to be displayed
 */
const getText = (str, isIpfsLink) => {
  if (!isIpfsLink) return str;

  const hash = str.substring(2);
  return `f01701220${hash}`;
};

/**
 * returns the redirect link based on the text
 * @example
 * input: '0x02c26437b292d86c5f4f21bbcce0771948274f84', false
 * output: 'https://etherscan.io/address/0x02c26437b292d86c5f4f21bbcce0771948274f84'
 *
 * input: '0x02c26437b292d86c5f4f21bbcce0771948274f84', true
 * output: 'https://GATEWAY_URL/ipfs/f01701220e0ed9d9a7e4ec046989c1c91f8fe367cf63681e75f75d6d0606105043048f5f9'
 */
const getRedirectLink = (text, isIpfsLink) => {
  if (isIpfsLink) {
    return `${GATEWAY_URL}/${text}`;
  }

  const isTransaction = /^0x([A-Fa-f0-9]{64})$/.test(text);
  const chainId = getChainId();
  const explorerUrl = getExplorerURL(chainId);

  return isTransaction
    ? `${explorerUrl}/tx/${text}`
    : `${explorerUrl}/address/${text}`;
};

export const AddressLink = ({
  text,
  suffixCount = 6,
  isIpfsLink = false,
  tooltipPlacement = 'bottom',
}) => {
  const trimmedText = getTrimmedText(
    getText(text, isIpfsLink),
    suffixCount,
  );

  return (
    <Tooltip title={text} placement={tooltipPlacement}>
      <a
        href={getRedirectLink(text, isIpfsLink)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {trimmedText}
      </a>
    </Tooltip>
  );
};
