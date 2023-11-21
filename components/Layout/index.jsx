import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { Layout as AntdLayout, Select } from 'antd';
import { useScreen } from '@autonolas/frontend-library';

import { PAGES_TO_LOAD_WITHOUT_CHAINID } from 'util/constants';
import { useHelpers } from 'common-util/hooks';
import { SUPPORTED_CHAINS_MORE_INFO } from 'common-util/Login/config';
import { useHandleRoute } from 'common-util/hooks/useHandleRoute';
import { LogoSvg, LogoIconSvg } from '../Logos';
import {
  CustomLayout,
  Logo,
  OlasHeader,
  RightMenu,
  SelectContainer,
} from './styles';

const Login = dynamic(() => import('../Login'), { ssr: false });
const NavigationMenu = dynamic(() => import('./Menu'), { ssr: false });
const Footer = dynamic(() => import('./Footer'), { ssr: false });

const { Content } = AntdLayout;

const Layout = ({ children }) => {
  const router = useRouter();
  const { isMobile, isTablet } = useScreen();
  const { chainId, chainName } = useHelpers();
  const path = router?.pathname || '';

  const { onHomeClick, updateChainId } = useHandleRoute();

  return (
    <CustomLayout>
      <OlasHeader ismobile={`${isMobile}`}>
        <Logo
          onClick={onHomeClick}
          data-testid="protocol-logo"
          ismobile={`${isMobile}`}
        >
          {isMobile || isTablet ? <LogoIconSvg /> : <LogoSvg />}
        </Logo>

        <SelectContainer>
          <Select
            style={{ width: 200 }}
            value={chainName}
            placeholder="Select Network"
            disabled={PAGES_TO_LOAD_WITHOUT_CHAINID.some((e) => path.includes(e))}
            options={SUPPORTED_CHAINS_MORE_INFO.map((e) => ({
              label: e.networkDisplayName,
              value: e.networkName,
            }))}
            onChange={(value) => {
              const currentChainInfo = SUPPORTED_CHAINS_MORE_INFO.find(
                (e) => e.networkName === value,
              );

              if (currentChainInfo) {
                // update session storage
                sessionStorage.setItem('chainId', currentChainInfo.id);

                // eg. /disclaimer will be redirect to same page ie. /disclaimer
                if (PAGES_TO_LOAD_WITHOUT_CHAINID.find((e) => e === path)) {
                  updateChainId(currentChainInfo.id);
                  router.push(`/${path}`);
                } else {
                  const replacedPath = router.asPath.replace(chainName, value);
                  router.push(`${replacedPath}`);
                }
              }
            }}
          />
        </SelectContainer>
        <NavigationMenu />
        <RightMenu>
          <Login />
        </RightMenu>
      </OlasHeader>

      <Content className="site-layout">
        <div className="site-layout-background">
          {/* chainId has to be set in redux before rendering any components OR
          the page doesn't depends on the chain Id */}
          {chainId || PAGES_TO_LOAD_WITHOUT_CHAINID.some((e) => e === path)
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
