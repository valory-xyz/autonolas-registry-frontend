import { useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { Layout as AntdLayout, Typography } from 'antd';
import { getNetworkName } from '@autonolas/frontend-library';
import { isL1Network } from 'common-util/functions';
import { useHelpers } from 'common-util/hooks';
// import Login from '../Login';
import Footer from './Footer';
import { CustomLayout, Logo, RightMenu } from './styles';

const { Text } = Typography;

const LogoSvg = dynamic(() => import('common-util/svg/logo'), { ssr: false });
const NavigationMenu = dynamic(() => import('./Menu'), { ssr: false });

const { Header, Content } = AntdLayout;

// eslint-disable-next-line no-unused-vars
const Layout = ({ children }) => {
  const router = useRouter();
  const { chainId, isValidChainId } = useHelpers();
  const path = router?.pathname || '';

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
      <LogoSvg />
      <span>
        {isValidChainId ? (
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
          {/* <Login /> */}
        </RightMenu>
      </Header>

      <Content className="site-layout">
        <div className="site-layout-background">
          {/* chainId has to be set in redux before rendering any components */}
          {/* {chainId ? children : null} */}
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
