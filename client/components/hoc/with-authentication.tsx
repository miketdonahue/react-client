import React, { Component } from 'react';
import Router from 'next/router';
import * as queries from '../../apollo/graphql/queries.graphql';

const withAuthentication = (WrappedComponent): any => {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  return class WithAuthentication extends Component {
    public static displayName = `WithAuthentication(${displayName})`;
    public static async getInitialProps({ apolloClient, res }): Promise<any> {
      const {
        data: {
          app: { isAuthenticated },
        },
      } = await apolloClient.query({
        query: queries.getCacheApp,
      });

      if (!isAuthenticated) {
        if (res) {
          res.writeHead(303, { Location: '/login' });
          res.end();
        } else {
          Router.replace('/login');
        }
      }

      return { isAuthenticated };
    }

    public render(): any {
      return <WrappedComponent {...this.props} />;
    }
  };
};

export default withAuthentication;
