import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { Layout as AntdLayout, Result, Typography } from 'antd/lib';
import useCheckMobileScreen from 'common-util/hooks/useCheckMobileScreen';
import { isL1Network } from 'common-util/functions';
import { getNetworkName } from '@autonolas/frontend-library';
import { SUPPORTED_CHAINS } from 'common-util/Login';
import Login from '../Login';
import Footer from './Footer';
import {
  CustomLayout, Logo, RightMenu, SupportOnlyDesktop,
} from './styles';

const { Text } = Typography;

const LogoSvg = dynamic(() => import('common-util/svg/logo'), { ssr: false });
const NavigationMenu = dynamic(() => import('./Menu'), { ssr: false });

const { Header, Content } = AntdLayout;

const Layout = ({ children }) => {
  const isMobile = useCheckMobileScreen();
  const router = useRouter();
  const account = useSelector((state) => state?.setup?.account);
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

  // show registry logo if account is present or chainId is not supported
  const isValidChainId = SUPPORTED_CHAINS.some((e) => e.id === chainId);
  const logo = (
    <Logo onClick={() => router.push('/')} data-testid="protocol-logo">
      <LogoSvg />
      <span>
        {account || !isValidChainId ? (
          'Registry'
        ) : (
          <div className="mr-16">
            <Text>{`Registry on ${getNetworkName(chainId)}`}</Text>
          </div>
        )}
      </span>
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
