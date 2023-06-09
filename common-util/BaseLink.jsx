import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { resolve } from 'url';
import Link from 'next/link';

export const BaseLink = ({ href, as, ...rest }) => {
  const newAs = useMemo(() => {
    let baseUriAs = as || href;

    // make absolute url relative
    // when displayed in url bar
    if (baseUriAs.startsWith('/')) {
      //  for static html compilation
      baseUriAs = `.${href}`;
      // <IPFSLink href="/about"> => <a class="jsx-2055897931" href="./about">About</a>

      // on the client
      // document is unavailable when compiling on the server
      if (typeof document !== 'undefined') {
        baseUriAs = resolve(document.baseURI, baseUriAs);
        // => <a href="https://gateway.ipfs.io/ipfs/Qm<hash>/about">About</a>
      }
    }
    return baseUriAs;
  }, [as, href]);

  return <Link {...rest} href={href} as={newAs} />;
};

export default BaseLink;

BaseLink.propTypes = {
  href: PropTypes.string.isRequired,
  as: PropTypes.string,
};

BaseLink.defaultProps = {
  as: undefined,
};
