import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { removeSubdomainFrom } from '@autonolas/frontend-library';

const Socials = () => {
  const [url, setUrl] = useState('https://autonolas.network');

  useEffect(() => {
    const currentUrl = window.location.origin;

    // if not localhost or vercel, remove subdomain
    // example: https://registry.orbis.network -> https://orbis.network
    if (!['localhost', 'vercel'].some((e) => currentUrl.includes(e))) {
      setUrl(removeSubdomainFrom());
    }
  }, []);

  const SOCIALS = [
    {
      type: 'web',
      url,
    },
    {
      type: 'github',
      url: 'https://github.com/valory-xyz/autonolas-governance',
    },
    {
      type: 'twitter',
      url: 'https://twitter.com/autonolas',
    },
  ];

  return (
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
};

export default Socials;
