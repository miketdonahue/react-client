import React from 'react';
import Head from 'next/head';
import { getDataFromTree } from 'react-apollo';
import initApollo from './init';

export default function withApolloClient(App): any {
  const displayName = App.displayName || App.name || 'Component';

  return class ApolloClient extends React.Component {
    public static displayName = `WithApollo(${displayName})`;
    public props: any;
    private apolloClient: any;

    public constructor(props) {
      super(props);

      this.apolloClient = initApollo(props.cache, {
        cookies: process.browser ? document.cookie : '',
      });
    }

    public static async getInitialProps(context): Promise<any> {
      const { Component, router, ctx } = context;
      const cookies = !process.browser ? ctx.req.cookies : document.cookie;

      let appProps = {};
      const apollo = initApollo({}, { cookies });
      const cache = apollo.cache.extract();

      // Add apollo client to the `getInitialProps` context
      ctx.apolloClient = apollo;

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
