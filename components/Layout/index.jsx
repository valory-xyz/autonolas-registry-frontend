import { useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { Layout as AntdLayout, Select, Typography } from 'antd';
import { getNetworkName, useScreen } from '@autonolas/frontend-library';

import { useHelpers } from 'common-util/hooks';
import { SUPPORTED_CHAINS } from 'common-util/Login';
import { toLower } from 'lodash';
import { SUPPORTED_CHAINS_MORE_INFO } from 'common-util/Login/config';
import {
  getCurrentChainInfo,
  getCustomNetworkName,
} from 'common-util/functions';
import { useDispatch } from 'react-redux';
import { setChainId } from 'store/setup/actions';
import { CustomLayout, Logo, RightMenu } from './styles';

const { Text } = Typography;

const Login = dynamic(() => import('../Login'), { ssr: false });
const NavigationMenu = dynamic(() => import('./Menu'), { ssr: false });
const Footer = dynamic(() => import('./Footer'), { ssr: false });

const { Header, Content } = AntdLayout;

const PAGES_TO_LOAD_WITHOUT_CHAINID = ['/', '/disclaimer'];

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    chainId, isL1Network, isValidChainId, chainName,
  } = useHelpers();
  const path = router?.pathname || '';
  const network = router?.query?.network;
  console.log({ network, chainId });
  const { isMobile } = useScreen();

  // useEffect(() => {
  //   if (network) {
  //     const isValidNetwork = SUPPORTED_CHAINS.some(
  //       (e) => toLower(e.name) === toLower(network),
  //     );
  //     // TODO
  //     if (!isValidNetwork) {
  //       router.push(`${SUPPORTED_CHAINS[0].name}/${path}`);
  //     }
  //   } else {
  //     router.push(`${SUPPORTED_CHAINS[0].name}/${path}`);
  //   }
  // }, [network]);

  const networkName = getCurrentChainInfo(chainId)?.network;

  // redirect to different pagess
  useEffect(() => {
    if (chainId && !isL1Network) {
      const shouldRedirect = !PAGES_TO_LOAD_WITHOUT_CHAINID.some(
        (e) => e === path,
      );
      console.log({ chainId, path });
      if (shouldRedirect) {
        router.push(`/${networkName}/${path}`);
      }

      // redirect to services page if user is on components or agents page
      // and chainId is not L1
      if (!isL1Network) {
        if (
          path.includes(`/${networkName}/components`)
          || path.includes(`/${networkName}/agents`)
        ) {
          router.push('/services');
        }
      }
    }
  }, [chainId, isL1Network]);

  const logo = (
    <Logo onClick={() => router.push('/')} data-testid="protocol-logo">
      <Image
        priority
        src="/images/logo.svg"
        height={32}
        width={32}
        alt="Autonolas"
      />

      <span>Registry</span>

      <Select
        size="small"
        value={chainName}
        options={SUPPORTED_CHAINS_MORE_INFO.map((e) => ({
          label: e.networkDisplayName,
          value: e.networkName,
        }))}
        onChange={(value) => {
          const id = SUPPORTED_CHAINS_MORE_INFO.find(
            (e) => e.network === value,
          )?.id;
          console.log(id, getCustomNetworkName(value));

          if (!id) return;

          console.log({ id, path, value });
          dispatch(setChainId(id));
          if (!shouldNotRedirect) {
            router.push(`/${getCustomNetworkName(value)}/${path}`);
          }
        }}
      />
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
