import App, { Container } from 'next/app';
import { ApolloProvider } from 'react-apollo';
import withApolloClient from '@client/apollo/with-apollo';
import { checkAuthentication } from '@client/modules';
import '@client/styles/semantic.less';

class NextApp extends App {
  public static async getInitialProps({ Component, ctx }): Promise<any> {
    let pageProps = {};

    // Redirects to root if unauthenticated
    await checkAuthentication(ctx);

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  public render(): any {
    const { Component, pageProps, apolloClient } = this.props;

    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </Container>
    );
  }

  private props: any;
}

export default withApolloClient(NextApp);
