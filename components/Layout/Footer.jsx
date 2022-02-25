import Image from 'next/image';
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
    <div className="footer">
      ©&nbsp;Valory&nbsp;
      {new Date().getFullYear()}
    </div>

    {getSocials()}
  </FooterContainer>
);

export default Footer;
