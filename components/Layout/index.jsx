import { useState, useEffect } from 'react';
import { Layout, Menu, Result } from 'antd/lib';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import useCheckMobileScreen from 'common-util/hooks/useCheckMobileScreen';
import Footer from './Footer';
import Login from '../Login';
import {
  CustomLayout, Logo, RightMenu, SupportOnlyDesktop,
} from './styles';

const LogoSvg = dynamic(() => import('common-util/svg/logo'), { ssr: false });

const { Header, Content } = Layout;

const NavigationBar = ({ children }) => {
  const isMobile = useCheckMobileScreen();
  const router = useRouter();
  const [selectedMenu, setSelectedMenu] = useState([]);
  const { pathname } = router;

  // to set default menu on first render
  useEffect(() => {
    if (pathname) {
      const name = pathname.split('/')[1];
      setSelectedMenu(name || null);
    }
  }, [pathname]);

  const handleMenuItemClick = ({ key }) => {
    router.push(`/${key}`);
    setSelectedMenu(key);
  };

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

        <Menu theme="light" mode="horizontal" selectedKeys={[selectedMenu]}>
          <Menu.Item key="components" onClick={handleMenuItemClick}>
            Components
          </Menu.Item>
          <Menu.Item key="agents" onClick={handleMenuItemClick}>
            Agents
          </Menu.Item>
          <Menu.Item key="services" onClick={handleMenuItemClick}>
            Services
          </Menu.Item>
        </Menu>

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
