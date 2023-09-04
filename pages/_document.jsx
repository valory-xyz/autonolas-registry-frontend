import Document, {
  Head, Html, Main, NextScript,
} from 'next/document';
import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs';
import { ServerStyleSheet } from 'styled-components';

const MyDocument = () => (
  <Html lang="en">
    <Head />
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

MyDocument.getInitialProps = async (ctx) => {
  const cache = createCache();
  const originalRenderPage = ctx.renderPage;
  const sheet = new ServerStyleSheet();

  ctx.renderPage = () => originalRenderPage({
    enhanceApp: (App) => (props) => (
      <StyleProvider cache={cache}>
        {sheet.collectStyles(<App {...props} />)}
      </StyleProvider>
    ),
  });

  try {
    const initialProps = await Document.getInitialProps(ctx);
    const style = extractStyle(cache, true);
    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <style dangerouslySetInnerHTML={{ __html: style }} />
          {sheet.getStyleElement()}
        </>
      ),
    };
  } finally {
    sheet.seal();
  }
};

export default MyDocument;
