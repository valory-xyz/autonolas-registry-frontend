import { Layout, Result } from 'antd/lib';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import useCheckMobileScreen from 'common-util/hooks/useCheckMobileScreen';
import { useEffect } from 'react';
import { isGnosis } from '@autonolas/frontend-library';
import Login from '../Login';
import Footer from './Footer';
import {
  CustomLayout, Logo, RightMenu, SupportOnlyDesktop,
} from './styles';

const LogoSvg = dynamic(() => import('common-util/svg/logo'), { ssr: false });
const NavigationMenu = dynamic(() => import('./Menu'), { ssr: false });

const { Header, Content } = Layout;

const NavigationBar = ({ children }) => {
  const isMobile = useCheckMobileScreen();
  const router = useRouter();
  const chainId = useSelector((state) => state?.setup?.chainId);
  const path = router?.pathname || '';

  useEffect(() => {
    if (chainId && isGnosis(chainId)) {
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

  // TODO: fix mobile responsiveness and remove the below component
  if (isMobile) {
    return (
      <CustomLayout hasSider>
        <Header>{logo}</Header>
        <SupportOnlyDesktop>
          <Result
            status="warning"
            title="Oops, Mobile & Tablet devices are not supported."
          />
        </SupportOnlyDesktop>
      </CustomLayout>
    );
  }

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
        <div className="site-layout-background">{children}</div>
      </Content>

      <Footer />
    </CustomLayout>
  );
};

NavigationBar.propTypes = {
  children: PropTypes.element,
};

NavigationBar.defaultProps = {
  children: null,
};

export default NavigationBar;
