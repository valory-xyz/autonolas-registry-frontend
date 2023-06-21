import { useState, useEffect } from 'react';
import { Layout, Menu, Result } from 'antd/lib';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import useCheckMobileScreen from 'common-util/hooks/useCheckMobileScreen';
import { isL1Network } from 'common-util/functions';
import Login from '../Login';
import Footer from './Footer';
import {
  CustomLayout, Logo, RightMenu, SupportOnlyDesktop,
} from './styles';

const LogoSvg = dynamic(() => import('common-util/svg/logo'), { ssr: false });

const { Header, Content } = Layout;

const NavigationBar = ({ children }) => {
  const chainId = useSelector((state) => state?.setup?.chainId);

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

  const items = [
    {
      label: 'Components',
      key: 'components',
    },
    {
      label: 'Agents',
      key: 'agents',
    },
  ];

  const serviceItem = [
    {
      label: 'Services',
      key: 'services',
    },
  ];

  // {isL1Network(chainId) && (
  //   <Menu.Item key="components" onClick={handleMenuItemClick}>
  //     Components
  //   </Menu.Item>
  // )}
  return (
    <CustomLayout>
      <Header>
        {logo}

        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[selectedMenu]}
          items={
            isL1Network(chainId) ? [...items, ...serviceItem] : serviceItem
          }
          onClick={handleMenuItemClick}
        />

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
