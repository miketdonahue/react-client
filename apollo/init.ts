import getConfig from 'next/config';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';

const { publicRuntimeConfig } = getConfig();

export default function initApollo(initialState = {}): any {
  const { host, port, graphql } = publicRuntimeConfig.server;
  const cache = new InMemoryCache().restore(initialState);

  const apolloClient = new ApolloClient({
    name: 'web',
    connectToDevTools: process.browser,
    ssrMode: !process.browser,
    link: createHttpLink({
      uri: `${host}:${port}${graphql.path}`,
      credentials: 'same-origin',
      fetch,
    }),
    cache,
    // typeDefs,
    // resolvers,
  });

  // Set cache initialState on first render of app
  cache.writeData({
    data: initialState,
  });

  return apolloClient;
}
