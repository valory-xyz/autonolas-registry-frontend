import { useEffect, useId } from 'react';
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
import {
  CustomLayout, Logo, RightMenu, SelectContainer,
} from './styles';

const { Text } = Typography;

const Login = dynamic(() => import('../Login'), { ssr: false });
const NavigationMenu = dynamic(() => import('./Menu'), { ssr: false });
const Footer = dynamic(() => import('./Footer'), { ssr: false });

const { Header, Content } = AntdLayout;

const PAGES_TO_LOAD_WITHOUT_CHAINID = ['/', '/disclaimer'];

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { chainId, isL1Network, chainName } = useHelpers();
  const path = router?.pathname || '';
  const networkNameFromUrl = router?.query?.network;
  // || 'mainnet'; // default to mainnet
  // console.log({
  //   networkNameFromUrl, chainName, chainId, LLL: router,
  // });

  const { isMobile } = useScreen();

  // useEffect(() => {
  //   if (networkNameFromUrl) {
  //     const isValidNetwork = SUPPORTED_CHAINS.some(
  //       (e) => toLower(e.name) === toLower(networkNameFromUrl),
  //     );
  //     // TODO
  //     if (!isValidNetwork) {
  //       router.push(`${SUPPORTED_CHAINS[0].name}/${path}`);
  //     }
  //   } else {
  //     router.push(`${SUPPORTED_CHAINS[0].name}/${path}`);
  //   }
  // }, [networkNameFromUrl]);

  // set chainId in local storage
  useEffect(() => {
    console.log('inside network hook', networkNameFromUrl);
    if (networkNameFromUrl) {
      // if the network name is not supported then redirect to mainnet
      // eg. /random/components => /mainnet/components
      const isValidNetworkName = SUPPORTED_CHAINS_MORE_INFO.some(
        (e) => toLower(e.networkName) === toLower(networkNameFromUrl),
      );

      if (isValidNetworkName) {
        const mapChainIdFromPath = SUPPORTED_CHAINS_MORE_INFO.find(
          (e) => toLower(e.networkName) === toLower(networkNameFromUrl),
        )?.id || 1;

        console.log(
          SUPPORTED_CHAINS_MORE_INFO.find(
            (e) => toLower(e.networkName) === toLower(networkNameFromUrl),
          )?.id,
        );

        // console.log({ networkNameFromUrl, mapChainIdFromPath });

        sessionStorage.setItem('chainId', mapChainIdFromPath);
        setTimeout(() => {
          dispatch(setChainId(mapChainIdFromPath));
        }, 0);
      } else {
        const updatedPath = router.asPath.replace(
          networkNameFromUrl,
          SUPPORTED_CHAINS_MORE_INFO[0].networkName,
        );
        // redirect to mainnet
        router.push(updatedPath);

        // there is no network name in the url so set it to default network (mainnet)
        sessionStorage.setItem('chainId', 1);
        setTimeout(() => {
          dispatch(setChainId(1));
        }, 0);
      }
    } else {
      // there is no network name in the url so set it to default network (mainnet)
      sessionStorage.setItem('chainId', 1);
      setTimeout(() => {
        dispatch(setChainId(1));
      }, 0);
    }
  }, [networkNameFromUrl]);

  // redirect to different pagess
  // useEffect(() => {
  //   if (chainId) {
  //     const shouldRedirect = !PAGES_TO_LOAD_WITHOUT_CHAINID.some(
  //       (e) => e === path,
  //     );
  //     // console.log({ chainId, path });
  //     // if (shouldRedirect) {
  //     //   router.push(`/${networkName}/${path}`);
  //     // }

  //     // redirect to services page if user is on components or agents page
  //     // and chainId is not L1
  //     if (!isL1Network) {
  //       if (
  //         path.includes(`/${networkName}/components`)
  //         || path.includes(`/${networkName}/agents`)
  //       ) {
  //         router.push('/services');
  //       }
  //     }
  //   }
  // }, [chainId, isL1Network]);

  // const dropdownOptions = isL1Network
  //   ? SUPPORTED_CHAINS_MORE_INFO
  //   : SUPPORTED_CHAINS_MORE_INFO.filter((e) => e.id === 1 || e.id === 5);
  const dropdownOptions = SUPPORTED_CHAINS_MORE_INFO;
  const filteredDropdownOptions = dropdownOptions.map((e) => ({
    label: e.networkDisplayName,
    value: e.networkName,
  }));

  console.log({
    chainName,
    filteredDropdownOptions,
  });

  return (
    <CustomLayout>
      <Header>
        <Logo onClick={() => router.push('/')} data-testid="protocol-logo">
          <Image
            priority
            src="/images/logo.svg"
            height={32}
            width={32}
            alt="Autonolas"
          />
          <span>Registry</span>
        </Logo>

        <SelectContainer>
          <Select
            style={{ width: 180 }}
            size="small"
            value={chainName}
            options={filteredDropdownOptions}
            onChange={(value) => {
              const currentChainInfo = SUPPORTED_CHAINS_MORE_INFO.find(
                (e) => e.networkName === value,
              );

              if (currentChainInfo) {
                // update session storage
                sessionStorage.setItem('chainId', currentChainInfo.id);

                if (PAGES_TO_LOAD_WITHOUT_CHAINID.find((e) => e === path)) {
                  router.push(`/${path}`);
                  dispatch(setChainId(currentChainInfo.id));
                } else {
                  const replacedPath = router.asPath.replace(chainName, value);
                  router.push(`${replacedPath}`);
                }
              }

              // set it after 0 seconds
              // setTimeout(() => {
              //   dispatch(setChainId(id));
              // }, 0);
            }}
          />
        </SelectContainer>
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
