import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { Layout as AntdLayout } from 'antd/lib';
import { isL1Network } from 'common-util/functions';
import Login from '../Login';
import Footer from './Footer';
import { CustomLayout, Logo, RightMenu } from './styles';

const LogoSvg = dynamic(() => import('common-util/svg/logo'), { ssr: false });
const NavigationMenu = dynamic(() => import('./Menu'), { ssr: false });

const { Header, Content } = AntdLayout;

const Layout = ({ children }) => {
  const router = useRouter();
  const chainId = useSelector((state) => state?.setup?.chainId);
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
      <span>Registry</span>
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
          {/* chainId has to be set in redux before rendering any components */}
          {chainId ? children : null}
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
