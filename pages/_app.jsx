import Head from 'next/head';
import { createWrapper } from 'next-redux-wrapper';
import { ConfigProvider } from 'antd';
import PropTypes from 'prop-types';

/** wagmi config */
import { WagmiConfig as WagmiConfigProvider } from 'wagmi';
import { wagmiConfig } from 'common-util/Login/config';

/** antd theme config */
// import dynamic from 'next/dynamic';
import Layout from 'components/Layout';
import GlobalStyle from 'components/GlobalStyles';
import { THEME_CONFIG } from '@autonolas/frontend-library';
import initStore from '../store';

// const Layout = dynamic(() => import('components/Layout'), { ssr: false });

const DESC = 'View and manage components, agents and services via the Autonolas on-chain registry.';

const MyApp = ({ Component, pageProps }) => (
  <>
    <GlobalStyle />
    <Head>
      <title>Autonolas Registry</title>
      <meta name="description" content={DESC} />
    </Head>
    <ConfigProvider theme={THEME_CONFIG}>
      <WagmiConfigProvider config={wagmiConfig}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </WagmiConfigProvider>
    </ConfigProvider>
  </>
);

MyApp.getInitialProps = async ({ Component, ctx }) => {
  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx)
    : {};

  return { pageProps };
};

MyApp.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({})])
    .isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

/* MyApp.defaultProps = {
  resetOnModalCloseFn: () => {},
}; */

const wrapper = createWrapper(initStore);
export default wrapper.withRedux(MyApp);
