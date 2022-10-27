import App from 'next/app';
import Head from 'next/head';
import { createWrapper } from 'next-redux-wrapper';
import PropTypes from 'prop-types';

// web3 libraries
import Web3 from 'web3';
import { Web3ReactProvider } from '@web3-react/core';

import { Web3DataProvider } from 'autonolas-frontend-library';
import GlobalStyle from 'components/GlobalStyles';
import Layout from 'components/Layout';
import initStore from '../store';

require('../styles/variables.less');

const getLibrary = (provider) => new Web3(provider);

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
          <title>Autonolas Protocol</title>
          <meta
            name="description"
            content="View and manage components, agents and services via the Autonolas on-chain registry."
          />
        </Head>
        <Web3DataProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Web3ReactProvider>
        </Web3DataProvider>
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
