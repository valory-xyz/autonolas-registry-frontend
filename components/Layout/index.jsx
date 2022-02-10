import { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Login from '../Login';
import { CustomLayout, Logo, RightMenu } from './styles';

const { Header, Content, Footer } = Layout;

const NavigationBar = ({ children }) => {
  const router = useRouter();
  const [selectedMenu, setSelectedMenu] = useState([]);
  const { pathname } = router;

  // to set default menu on first render
  useEffect(() => {
    if (pathname) {
      const name = pathname.split('/')[1];
      setSelectedMenu(name || 'components');
    }
  }, [pathname]);

  const handleMenuItemClick = ({ key }) => {
    // `components` is the homepage hence ''
    const pushTo = key === 'components' ? '' : key;
    router.push(`/${pushTo}`);
    setSelectedMenu(key);
  };

  return (
    <CustomLayout>
      <Header>
        <Logo onClick={() => router.push('/')} data-testid="protocol-logo">
          <div className="title-logo" />
          Registry
        </Logo>

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
          <Menu.Item key="operators" onClick={handleMenuItemClick} disabled>
            Operators
          </Menu.Item>
        </Menu>

        <RightMenu>
          <Login />
        </RightMenu>
      </Header>

      <Content className="site-layout">
        <div className="site-layout-background">{children}</div>
      </Content>

      <Footer>
        ©&nbsp;Valory&nbsp;
        {new Date().getFullYear()}
      </Footer>
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
