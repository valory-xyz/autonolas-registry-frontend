import App from 'next/app';
import Head from 'next/head';
import { createWrapper } from 'next-redux-wrapper';
import { ConfigProvider } from 'antd';
import PropTypes from 'prop-types';
import { COLOR } from '@autonolas/frontend-library';

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
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: COLOR.PRIMARY,
                fontSize: 18,
                borderRadius: 5,
                colorBgBase: COLOR.WHITE,
                colorTextPlaceholder: COLOR.GREY_2,
                colorLink: COLOR.PRIMARY,
                controlHeight: 42,
              },
              components: {
                Layout: {
                  colorBgHeader: COLOR.WHITE,
                  // lineHeightHeader: 60,
                  lineHeight: 64,
                },
                Typography: {
                  // titleMarginBottom: 0,
                },
                // Input: {
                //   height: 50,
                // }
                Tabs: {
                  // motionDurationFast: 0,
                  motionDurationMid: '0.1s',
                  motionDurationSlow: '0.1s',
                  // borderRadius: 18,
                  // colorBorder: 'transparent',
                  // colorBgBase: COLOR.BLACK,
                },
              },
            }}
          >
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ConfigProvider>
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

/**
 * thought process:
 * 1. create a new component that wraps the app - configProvider
 * https://ant.design/docs/react/migrate-less-variables - to match the current design
 * 2. themeProvider - https://ant.design/docs/react/customize-theme
 * 3. usage of antd icons
 * 4. try to check the performance with blank page
 */
