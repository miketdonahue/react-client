import React, { Component } from 'react';
import Router from 'next/router';
import Cookies from 'universal-cookie';
import * as queries from '@client/apollo/graphql/queries.graphql';

const withAuthentication = (WrappedComponent): any => {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  return class WithAuthentication extends Component {
    public static displayName = `WithAuthentication(${displayName})`;
    public static async getInitialProps(context): Promise<any> {
      const { apolloClient, req, res } = context;
      let appProps = {};
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

      if (!isAuthenticated) {
        if (res) {
          res.writeHead(302, { Location: '/login' });
          res.end();
        } else {
          Router.replace('/login');
        }
      }

      if (WrappedComponent.getInitialProps) {
        appProps = await WrappedComponent.getInitialProps(context);
      }

      return { ...appProps };
    }

    public render(): any {
      return <WrappedComponent {...this.props} />;
    }
  };
};

export default withAuthentication;
