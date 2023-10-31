import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import {
  Footer as CommonFooter,
  getExplorerURL,
} from '@autonolas/frontend-library';

import { PATHS_NOT_TO_SHOW } from 'util/constants';
import { ADDRESSES } from 'common-util/Contracts';
import { useHelpers } from 'common-util/hooks';
import Socials from './Socials';
import { ContractsInfoContainer } from './styles';

const ContractInfo = () => {
  const { chainId, isL1Network, doesNetworkHaveValidServiceManagerToken } = useHelpers();
  const router = useRouter();

  const { pathname } = router;

  // if chainId is not set, show empty container
  if (!chainId) return <ContractsInfoContainer />;

  const addresses = ADDRESSES[chainId];
  const getCurrentPageAddresses = () => {
    if (addresses && (pathname || '').includes('components')) {
      return {
        registryText: 'ComponentRegistry',
        managerText: 'RegistriesManager',
        registry: addresses.componentRegistry,
        manager: addresses.registriesManager,
      };
    }

    if (addresses && (pathname || '').includes('agents')) {
      return {
        registryText: 'AgentRegistry',
        managerText: 'RegistriesManager',
        registry: addresses.agentRegistry,
        manager: addresses.registriesManager,
      };
    }

    if (addresses && (pathname || '').includes('services')) {
      return {
        registryText: 'ServiceRegistry',
        managerText: 'ServiceManager',
        registry: isL1Network
          ? addresses.serviceRegistry
          : addresses.serviceRegistryL2,
        manager: doesNetworkHaveValidServiceManagerToken
          ? addresses.serviceManagerToken
          : addresses.serviceManager,
      };
    }

    return {
      registry: null,
      manager: null,
      registryText: null,
      managerText: null,
    };
  };

  const getContractInfo = (text, addressToPoint) => (
    <div className="registry-contract">
      &nbsp;•&nbsp;
      <a
        href={`${getExplorerURL(chainId)}/address/${addressToPoint}`}
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
          <div>
            <Image
              src="/images/etherscan-logo.svg"
              width={18}
              height={18}
              alt="Etherscan link"
            />
            <span>Contracts</span>
          </div>
          {getContractInfo(registryText, registry)}
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
        &nbsp;•&nbsp;
        <a
          href="https://gateway.autonolas.tech/ipfs/bafybeibrhz6hnxsxcbv7dkzerq4chssotexb276pidzwclbytzj7m4t47u"
          target="_blank"
          rel="noopener noreferrer"
        >
          DAO Constitution
        </a>
      </>
    )}
  />
);

export default Footer;
