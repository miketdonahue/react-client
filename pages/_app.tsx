import React from 'react';
import App, { Container } from 'next/app';
import { ApolloProvider, Query } from 'react-apollo';
import withApolloClient from '../client/apollo/with-apollo';
import * as queries from '../client/apollo/graphql/queries.graphql';
import '../client/styles/semantic.less';

interface Data {
  app: {
    isLoggedIn: boolean;
  };
}

class NextApp extends App {
  public render(): any {
    const { Component, pageProps, apolloClient } = this.props;

    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <Query<Data> query={queries.getCacheApp}>
            {({ data, error }) => {
              return <Component {...pageProps} />;
            }}
          </Query>
        </ApolloProvider>
      </Container>
    );
  }

  private props: any;
}

export default withApolloClient(NextApp);
