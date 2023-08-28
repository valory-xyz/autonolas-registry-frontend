import { useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { Layout as AntdLayout, Typography } from 'antd';
import { getNetworkName } from '@autonolas/frontend-library';
import { isL1Network } from 'common-util/functions';
import { useHelpers } from 'common-util/hooks';
import { useScreen } from 'common-util/hooks/useScreen';
import { CustomLayout, Logo, RightMenu } from './styles';

const { Text } = Typography;

const Login = dynamic(() => import('../Login'), { ssr: false });
const NavigationMenu = dynamic(() => import('./Menu'), { ssr: false });
const Footer = dynamic(() => import('./Footer'), { ssr: false });

const { Header, Content } = AntdLayout;

const FILES_TO_LOAD_WITHOUT_CHAINID = ['/', '/disclaimer'];

const Layout = ({ children }) => {
  const router = useRouter();
  const { chainId, isValidChainId } = useHelpers();
  const path = router?.pathname || '';
  const { isMobile } = useScreen();

  useEffect(() => {
    if (chainId && !isL1Network(chainId)) {
      // redirect to services page if user is on components or agents page
      // and chainId is gnosis
      if (path.includes('/components') || path.includes('/agents')) {
        router.push('/services');
      }
    }
  }, [chainId]);

  const logo = (
    <Logo onClick={() => router.push('/')} data-testid="protocol-logo">
      <Image
        priority
        src="/images/logo.svg"
        height={32}
        width={32}
        alt="Autonolas"
      />

      <span>
        {isValidChainId && !isMobile ? (
          <Text>{`Registry on ${getNetworkName(chainId)}`}</Text>
        ) : (
          'Registry'
        )}
      </span>
    </Logo>
  );

  return (
    <CustomLayout>
      <Header>
        {logo}
        <NavigationMenu />
        <RightMenu>
          <Login />
        </RightMenu>
      </Header>

      <Content className="site-layout">
        <div className="site-layout-background">
          {/* chainId has to be set in redux before rendering any components OR
          the page doesn't depends on the chain Id */}
          {chainId || FILES_TO_LOAD_WITHOUT_CHAINID.some((e) => e === path)
            ? children
            : null}
        </div>
      </Content>

      <Footer />
    </CustomLayout>
  );
};

Layout.propTypes = {
  children: PropTypes.element,
};

Layout.defaultProps = {
  children: null,
};

export default Layout;
