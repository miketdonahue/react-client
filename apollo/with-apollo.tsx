import React from 'react';
import Head from 'next/head';
import { getDataFromTree } from 'react-apollo';
import initApollo from './init';

export default function withApolloClient(App): any {
  return class ApolloClient extends React.Component {
    public static displayName = `WithApollo(App)`;

    public constructor(props) {
      super(props);

      this.apolloClient = initApollo(props.apolloState);
    }

    public static async getInitialProps(ctx): Promise<any> {
      const { Component, router } = ctx;
      let appProps = {};
      const apollo = initApollo();
      const apolloState = apollo.extract();

      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx);
      }

      if (!process.browser) {
        try {
          await getDataFromTree(
            <App
              {...appProps}
              Component={Component}
              router={router}
              apolloClient={apollo}
            />
          );
        } catch (error) {
          console.error('Error while running `getDataFromTree`', error);
        }

        Head.rewind();
      }

      return {
        ...appProps,
        apolloState,
      };
    }

    private apolloClient: any;
    public props: any;

    public render(): any {
      return <App {...this.props} apolloClient={this.apolloClient} />;
    }
  };
}
