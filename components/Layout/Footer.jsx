import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import get from 'lodash/get';
import { Footer as CommonFooter } from '@autonolas/frontend-library';
import { ADDRESSES } from 'common-util/Contracts';
import {
  isGoerli,
  isGnosis,
  isPolygon,
  isPolygonMumbai,
} from 'common-util/functions';
import Socials from './Socials';
import { ContractsInfoContainer } from './styles';

// should not display contracts on homepage
const PATHS_NOT_TO_SHOW = ['/', '/disclaimer'];

const ContractInfo = () => {
  const chainId = useSelector((state) => get(state, 'setup.chainId'));
  const router = useRouter();

  const { pathname } = router;

  // if chainId is not set, show empty container
  if (!chainId) return <ContractsInfoContainer />;

  const addresses = ADDRESSES[chainId];
  const getCurrentPageAddresses = () => {
    if ((pathname || '').includes('components')) {
      return {
        registryText: 'ComponentRegistry',
        managerText: 'RegistriesManager',
        registry: addresses?.componentRegistry,
        manager: addresses?.registriesManager,
      };
    }

    if ((pathname || '').includes('agents')) {
      return {
        registryText: 'AgentRegistry',
        managerText: 'RegistriesManager',
        registry: addresses?.agentRegistry,
        manager: addresses?.registriesManager,
      };
    }

    if ((pathname || '').includes('services')) {
      return {
        registryText: 'ServiceRegistry',
        managerText: 'ServiceManager',
        registry: addresses?.serviceRegistry,
        manager: addresses?.serviceManager,
      };
    }

    return {
      registry: null,
      manager: null,
      registryText: null,
      managerText: null,
    };
  };

  const getEtherscanLink = (address) => {
    if (isGoerli(chainId)) {
      return `https://goerli.etherscan.io/address/${address}`;
    }
    if (isGnosis(chainId)) {
      return `https://gnosisscan.io/address/${address}`;
    }
    if (isPolygon(chainId)) {
      return `https://polygonscan.com/address/${address}`;
    }
    if (isPolygonMumbai(chainId)) {
      return `https://mumbai.polygonscan.com/address/${address}`;
    }
    return `https://etherscan.io/address/${address}`;
  };

  const getContractInfo = (text, addressToPoint) => (
    <div className="registry-contract">
      <a
        href={getEtherscanLink(addressToPoint)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {text}
      </a>
    </div>
  );

  const {
    registry, manager, managerText, registryText,
  } = getCurrentPageAddresses();

  return (
    <ContractsInfoContainer>
      {!PATHS_NOT_TO_SHOW.includes(pathname) && (
        <>
          <img
            alt="Etherscan link"
            width={18}
            height={18}
            src="/images/etherscan-logo.svg"
          />
          <span>Contracts</span>
          &nbsp;•&nbsp;
          {getContractInfo(registryText, registry)}
          &nbsp;•&nbsp;
          {getContractInfo(managerText, manager)}
        </>
      )}
    </ContractsInfoContainer>
  );
};

const Footer = () => (
  <CommonFooter
    leftContent={<ContractInfo />}
    rightContent={<Socials />}
    centerContent={(
      <>
        ©&nbsp;Autonolas DAO&nbsp;
        {new Date().getFullYear()}
        &nbsp;•&nbsp;
        <Link href="/disclaimer">Disclaimer</Link>
      </>
    )}
  />
);

export default Footer;
