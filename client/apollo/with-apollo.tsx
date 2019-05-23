import React from 'react';
import Head from 'next/head';
import { getDataFromTree } from 'react-apollo';
import initApollo from './init';

export default function withApolloClient(App): any {
  return class ApolloClient extends React.Component {
    public static displayName = `WithApollo(${App.displayName ||
      App.name ||
      'Unknown'})`;

    public props: any;
    private apolloClient: any;

    public constructor(props) {
      super(props);

      this.apolloClient = initApollo(props.state, {});
    }

    public static async getInitialProps(context): Promise<any> {
      const { Component, router, ctx } = context;
      let appProps = {};
      const apollo = initApollo({}, { cookies: ctx.req.cookies });
      const cache = apollo.cache.extract();

      if (App.getInitialProps) {
        appProps = await App.getInitialProps(context);
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
        } catch (err) {
          console.log('Error while running `getDataFromTree`', err);
        }

        Head.rewind();
      }

      return {
        ...appProps,
        cache,
      };
    }

    public render(): any {
      return <App {...this.props} apolloClient={this.apolloClient} />;
    }
  };
}
