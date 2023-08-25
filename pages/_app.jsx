/* eslint-disable max-len */
import App from 'next/app';
import Head from 'next/head';
import { createWrapper } from 'next-redux-wrapper';
import { ConfigProvider } from 'antd';
import PropTypes from 'prop-types';

// import { WagmiConfig } from 'wagmi';
import { themeConfig } from 'util/theme';
// import Layout from 'components/Layout';
import GlobalStyle from 'components/GlobalStyles';
// import { wagmiConfig } from 'common-util/Login/config';
import initStore from '../store';

const DESC = 'View and manage components, agents and services via the Autonolas on-chain registry.';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};

    return { pageProps };
  }

  render() {
    // const { Component, pageProps } = this.props;

    return (
      <>
        <GlobalStyle />
        <Head>
          <title>Autonolas Registry</title>
          <meta name="description" content={DESC} />
        </Head>
        <ConfigProvider theme={themeConfig}>
          <div>Hello world</div>
          {/* <WagmiConfig config={wagmiConfig}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </WagmiConfig> */}
        </ConfigProvider>
      </>
    );
  }
}

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

/**
 * thought process:
 * 1. create a new component that wraps the app - configProvider
 * https://ant.design/docs/react/migrate-less-variables - to match the current design
 * 2. themeProvider - https://ant.design/docs/react/customize-theme
 * 3. usage of antd icons
 * 4. try to check the performance with blank page
 *
 *
 *
 *
 * OPTIMIZATION:
 * https://github.com/vercel/next.js/discussions/13646#discussioncomment-5544203
 */
