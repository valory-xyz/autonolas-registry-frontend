import App from 'next/app';
import Head from 'next/head';
import { createWrapper } from 'next-redux-wrapper';
import PropTypes from 'prop-types';

// web3 libraries
import Web3 from 'web3';
import { Web3ReactProvider } from '@web3-react/core';

import GlobalStyle from 'components/GlobalStyles';
import initStore from '../store';
import './styles.less';

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
    // TODO: ask Oak about title, meta, etc
    return (
      <>
        <Head>
          <title>Protocol</title>
          <meta name="description" content="Protocol" />
        </Head>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Component {...pageProps} />
        </Web3ReactProvider>
        <GlobalStyle />
      </>
    );
  }
}

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

/* MyApp.defaultProps = {
  resetOnModalCloseFn: () => {},
}; */

const wrapper = createWrapper(initStore);
export default wrapper.withRedux(MyApp);
