import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { Layout as AntdLayout, Select } from 'antd';
import { useScreen } from '@autonolas/frontend-library';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { web3 } from '@project-serum/anchor';

import { PAGES_TO_LOAD_WITHOUT_CHAINID, SOLANA_CHAIN_NAMES } from 'util/constants';
import { useHelpers } from 'common-util/hooks';
import {
  ALL_SUPPORTED_CHAINS,
  SVM_SUPPORTED_CHAINS,
  getSvmClusterName,
} from 'common-util/Login/config';
import { useHandleRoute } from 'common-util/hooks/useHandleRoute';
import { LogoSvg, LogoIconSvg } from '../Logos';
import {
  CustomLayout,
  Logo,
  OlasHeader,
  RightMenu,
  SelectContainer,
} from './styles';

const DEFAULT_SVM_CLUSTER = getSvmClusterName(SOLANA_CHAIN_NAMES.MAINNET);

/**
 * Get the cluster name for a given Solana network name.
 * If it's mainnet, directly return the endpoint at process.env.NEXT_PUBLIC_SOLANA_MAINNET_URL.
 * Otherwise, return web3.clusterApiUrl and pass in the devnet cluster name.
 * @param {string} networkName - The network name to get the cluster for.
 * @returns {string} The endpoint URL associated with the network name.
 */
export const getSvmEndpoint = (networkName) => {
  const chain = SVM_SUPPORTED_CHAINS.find((c) => c.networkName === networkName);
  if (chain?.networkName === SOLANA_CHAIN_NAMES.MAINNET) {
    return process.env.NEXT_PUBLIC_SOLANA_MAINNET_BETA_URL;
  }
  return chain ? web3.clusterApiUrl(chain.clusterName) : web3.clusterApiUrl(DEFAULT_SVM_CLUSTER);
};

const wallets = [new PhantomWalletAdapter()];

const Login = dynamic(() => import('../Login'), { ssr: false });
const NavigationMenu = dynamic(() => import('./Menu'), { ssr: false });
const Footer = dynamic(() => import('./Footer'), { ssr: false });

const { Content } = AntdLayout;

const Layout = ({ children }) => {
  const router = useRouter();
  const { isMobile, isTablet } = useScreen();
  const {
    vmType, isSvm, chainId, chainName,
  } = useHelpers();
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

        <SelectContainer style={{ marginRight: isMobile ? 8 : 0 }}>
          <Select
            className="show-scrollbar"
            style={{ width: isMobile ? 140 : 200 }}
            value={chainName}
            placeholder="Select Network"
            disabled={PAGES_TO_LOAD_WITHOUT_CHAINID.some((e) => path.includes(e))}
            options={ALL_SUPPORTED_CHAINS.map((e) => ({
              label: e.networkDisplayName,
              value: e.networkName,
            }))}
            onChange={(value) => {
              const currentChainInfo = ALL_SUPPORTED_CHAINS.find(
                (e) => e.networkName === value,
              );

              if (currentChainInfo) {
                // update session storage
                sessionStorage.setItem('chainId', currentChainInfo.id);

                if (PAGES_TO_LOAD_WITHOUT_CHAINID.find((e) => e === path)) {
                  // eg. /disclaimer will be redirect to same page ie. /disclaimer
                  updateChainId(currentChainInfo.id);
                  router.push(`/${path}`);
                } else {
                  // eg. /components, /agents, /services will be redirect to
                  // /<chainName>/components, /<chainName>/agents, /<chainName>/services
                  const replacedPath = router.asPath.replace(chainName, value);

                  // reload the page if vmType is different
                  // ie. user switched from svm to eth or vice versa
                  if (vmType !== currentChainInfo.vmType) {
                    window.open(replacedPath, '_self');
                  } else {
                    router.push(replacedPath);
                  }
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
          {/* chainId has to be set in redux before rendering any components
              OR the page doesn't depends on the chain Id
              OR it is SOLANA */}
          {chainId
          || isSvm
          || PAGES_TO_LOAD_WITHOUT_CHAINID.some((e) => e === path)
            ? children
            : null}
        </div>
      </Content>

      <Footer />
    </CustomLayout>
  );
};

Layout.propTypes = { children: PropTypes.element };
Layout.defaultProps = { children: null };

const LayoutWithWalletProvider = (props) => {
  const { chainName, isSvm } = useHelpers();

  const endpoint = getSvmEndpoint(chainName);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={isSvm}>
        <Layout {...props}>{props.children}</Layout>
      </WalletProvider>
    </ConnectionProvider>
  );
};

LayoutWithWalletProvider.propTypes = { children: PropTypes.element };
LayoutWithWalletProvider.defaultProps = { children: null };
export default LayoutWithWalletProvider;
