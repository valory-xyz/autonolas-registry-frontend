import App from 'next/app';
import Head from 'next/head';
import { createWrapper } from 'next-redux-wrapper';
import PropTypes from 'prop-types';

import { WagmiConfig } from 'wagmi';
import GlobalStyle from 'components/GlobalStyles';
import Layout from 'components/Layout';
import { wagmiConfig } from 'common-util/Login/config';
import initStore from '../store';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <GlobalStyle />
        <Head>
          <title>Autonolas Registry</title>
          <meta
            name="description"
            content="View and manage components, agents and services via the Autonolas on-chain registry."
          />
        </Head>
        <WagmiConfig config={wagmiConfig}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </WagmiConfig>
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
