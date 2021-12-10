import { Layout, Menu } from 'antd';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Login from '../Login';
import { CustomLayout, Logo, RightMenu } from './styles';

const { Header, Content, Footer } = Layout;

const NavigationBar = ({ children }) => {
  const router = useRouter();

  return (
    <CustomLayout>
      <Header>
        <Logo onClick={() => router.push('/')}>Registry</Logo>

        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={['components']}
        >
          <Menu.Item key="components" onClick={() => router.push('/')}>
            Components
          </Menu.Item>
          <Menu.Item key="services" onClick={() => router.push('/services')}>
            Services
          </Menu.Item>
          <Menu.Item key="operators" onClick={() => router.push('/operators')}>
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
        Protocol ©
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
