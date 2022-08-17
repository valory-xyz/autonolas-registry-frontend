import Image from 'next/image';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import get from 'lodash/get';
import { ADDRESSES } from 'common-util/Contracts';
import { FooterContainer } from './styles';

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

  if (!chainId || !addresses) return null;

  const getCurrentPageAddresses = () => {
    if ((pathname || '').includes('components')) {
      return {
        registry: addresses.componentRegistry,
        manager: addresses.registriesManager,
      };
    }

    if ((pathname || '').includes('agents')) {
      return {
        registry: addresses.agentRegistry,
        manager: addresses.registriesManager,
      };
    }

    if ((pathname || '').includes('services')) {
      return {
        registry: addresses.serviceRegistry,
        manager: addresses.serviceManager,
      };
    }

    return { registry: null, manager: null };
  };

  const getEtherscanLink = (address) => {
    if (chainId === 5) return `https://goerli.etherscan.io/address/${address}`;
    return `https://etherscan.io/address/${address}`;
  };

  const getContractInfo = (text, addressToPoint) => (
    <div className="registry-contract">
      <span>{text}</span>
      <a
        href={getEtherscanLink(addressToPoint)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          alt="Etherscan link"
          width={18}
          height={18}
          src="/images/etherscan-logo.svg"
        />
      </a>
    </div>
  );

  const { registry, manager } = getCurrentPageAddresses();

  return (
    <>
      {getContractInfo('Registry Contract:', registry)}
      {getContractInfo('Manager Contract:', manager)}
    </>
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

const Footer = () => (
  <FooterContainer>
    <div className="contracts-info">
      <ContractInfo />
    </div>

    <div className="footer">
      ©&nbsp;Valory&nbsp;
      {new Date().getFullYear()}
    </div>

    {getSocials()}
  </FooterContainer>
);

export default Footer;
