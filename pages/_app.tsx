import App, { Container } from 'next/app';
import { ApolloProvider } from 'react-apollo';
import withApolloClient from '../client/apollo/with-apollo';
import '../client/styles/semantic.less';

class NextApp extends App {
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
