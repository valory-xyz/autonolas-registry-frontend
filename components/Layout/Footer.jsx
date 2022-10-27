import Image from 'next/image';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import get from 'lodash/get';
// import { Footer as CommonFooter } from 'autonolas-frontend-library';
import { ADDRESSES } from 'common-util/Contracts';
import { ContractsInfoContainer } from './styles';

const SOCIALS = [
  {
    type: 'web',
    url: 'https://www.autonolas.network',
  },
  {
    type: 'medium',
    url: 'https://autonolas.medium.com/',
  },
  {
    type: 'twitter',
    url: 'https://twitter.com/autonolas',
  },
  {
    type: 'github',
    url: 'https://github.com/valory-xyz',
  },
];

const ContractInfo = () => {
  const chainId = useSelector((state) => get(state, 'setup.chainId'));
  const router = useRouter();
  const { pathname } = router;
  const addresses = ADDRESSES[chainId];
  if (!chainId || !addresses) return <ContractsInfoContainer />;

  const getCurrentPageAddresses = () => {
    if ((pathname || '').includes('components')) {
      return {
        registryText: 'ComponentRegistry',
        managerText: 'ComponentManager',
        registry: addresses.componentRegistry,
        manager: addresses.registriesManager,
      };
    }

    if ((pathname || '').includes('agents')) {
      return {
        registryText: 'ComponentRegistry',
        managerText: 'ComponentManager',
        registry: addresses.agentRegistry,
        manager: addresses.registriesManager,
      };
    }

    if ((pathname || '').includes('services')) {
      return {
        registryText: 'ServiceRegistry',
        managerText: 'ServiceManager',
        registry: addresses.serviceRegistry,
        manager: addresses.serviceManager,
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
    if (chainId === 5) return `https://goerli.etherscan.io/address/${address}`;
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
      {/* should not display contracts on homepage */}
      {pathname !== '/' && (
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

export const getSocials = () => (
  <div className="socials">
    {SOCIALS.map((social) => {
      const src = `/images/${social.type}.svg`;

      return (
        <a
          href={social.url}
          className={social.type}
          target="_blank"
          rel="noopener noreferrer"
          key={`social-${social.type}`}
          aria-label={`social-${social.type}`}
        >
          <Image src={src} alt="" width={18} height={16} />
        </a>
      );
    })}
  </div>
);

// const Footer = () => (
//   <CommonFooter leftContent={<ContractInfo />} rightContent={getSocials()} />
// );

const Footer = () => <>FOOTER</>

export default Footer;
