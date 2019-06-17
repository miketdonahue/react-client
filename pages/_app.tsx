import App, { Container } from 'next/app';
import { ApolloProvider } from 'react-apollo';
import withApolloClient from '@client/apollo/with-apollo';
import Router from 'next/router';
import Cookies from 'universal-cookie';
import * as queries from '@pages/login/graphql/queries.graphql';
import '@client/styles/semantic.less';

class NextApp extends App {
  public static async getInitialProps({ ctx }): Promise<any> {
    const { apolloClient, req, res, pathname } = ctx;
    const urlPathname = process.browser ? pathname : req.url;
    const universalCookies = process.browser
      ? document.cookie
      : req.headers.cookie;
    const cookies = new Cookies(universalCookies);
    const token = cookies.get('jwt') || '';

    const {
      data: { isAuthenticated },
    } = await apolloClient.query({
      query: queries.isAuthenticated,
      variables: { input: { token } },
    });

    if (urlPathname !== '/login' && !isAuthenticated) {
      if (res) {
        res.writeHead(302, { Location: '/login' });
        res.end();
      } else {
        Router.replace('/login');
      }
    }

    return {};
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
