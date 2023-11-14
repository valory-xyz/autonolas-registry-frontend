import { useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { Layout as AntdLayout, Select } from 'antd';

import { useHelpers } from 'common-util/hooks';
import { toLower } from 'lodash';
import { SUPPORTED_CHAINS_MORE_INFO } from 'common-util/Login/config';
import { useDispatch } from 'react-redux';
import { setChainId } from 'store/setup/actions';
import {
  CustomLayout, Logo, RightMenu, SelectContainer,
} from './styles';

const Login = dynamic(() => import('../Login'), { ssr: false });
const NavigationMenu = dynamic(() => import('./Menu'), { ssr: false });
const Footer = dynamic(() => import('./Footer'), { ssr: false });

const { Header, Content } = AntdLayout;

const PAGES_TO_LOAD_WITHOUT_CHAINID = ['/disclaimer'];

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { chainId, chainName } = useHelpers();
  const path = router?.pathname || '';
  const networkNameFromUrl = router?.query?.network;

  const updateChainId = (id) => {
    sessionStorage.setItem('chainId', id);
    setTimeout(() => {
      dispatch(setChainId(id));
    }, 0);
  };

  // set chainId in local storage
  useEffect(() => {
    if (networkNameFromUrl) {
      // if the network name is not supported then redirect to ethereum
      // eg. /random/components => /ethereum/components
      const isValidNetworkName = SUPPORTED_CHAINS_MORE_INFO.some(
        (e) => toLower(e.networkName) === toLower(networkNameFromUrl),
      );

      if (isValidNetworkName) {
        const mapChainIdFromPath = SUPPORTED_CHAINS_MORE_INFO.find(
          (e) => toLower(e.networkName) === toLower(networkNameFromUrl),
        )?.id || 1;

        updateChainId(mapChainIdFromPath);
      } else {
        // updated the url with default network name (ethereum)
        const updatedPath = router.asPath.replace(
          networkNameFromUrl,
          SUPPORTED_CHAINS_MORE_INFO[0].networkName,
        );
        router.push(updatedPath);

        // there is no network name in the url so set it to default network (ethereum)
        updateChainId(1);
      }
    } else {
      // there is no network name in the url so set it to default network (ethereum)
      router.push('/ethereum');
    }
  }, [networkNameFromUrl]);

  const dropdownOptions = SUPPORTED_CHAINS_MORE_INFO.map((e) => {
    // disable all the networks except mainnet & goerli
    // if the user is on components or agents page
    const isDisabled = e.id !== 1
      && e.id !== 5
      && (path.includes('components') || path.includes('agents'));

    return {
      label: e.networkDisplayName,
      value: e.networkName,
      disabled: isDisabled,
    };
  });

  const onLogoClick = () => router.push('/');

  return (
    <CustomLayout>
      <Header>
        <Logo onClick={onLogoClick} data-testid="protocol-logo">
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
            options={dropdownOptions}
            onChange={(value) => {
              const currentChainInfo = SUPPORTED_CHAINS_MORE_INFO.find(
                (e) => e.networkName === value,
              );

              if (currentChainInfo) {
                // update session storage
                sessionStorage.setItem('chainId', currentChainInfo.id);

                // eg. /disclaimer will be redirect to same page ie. /disclaimer
                if (PAGES_TO_LOAD_WITHOUT_CHAINID.find((e) => e === path)) {
                  router.push(`/${path}`);
                  dispatch(setChainId(currentChainInfo.id));
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
