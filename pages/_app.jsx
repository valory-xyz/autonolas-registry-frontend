import App from 'next/app';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { createWrapper } from 'next-redux-wrapper';
import PropTypes from 'prop-types';

// web3 libraries
import Web3 from 'web3';
import { Web3ReactProvider } from '@web3-react/core';

import GlobalStyle from 'components/GlobalStyles';
import MetamaskProvider from 'components/Login/Helpers/MetamaskProvider';
import initStore from '../store';

const Layout = dynamic(() => import('components/Layout'), { ssr: false });

require('../styles/antd.less');

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
          <title>Protocol</title>
          <meta name="description" content="Protocol" />
        </Head>
        <Web3ReactProvider getLibrary={getLibrary}>
          <MetamaskProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </MetamaskProvider>
        </Web3ReactProvider>
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
