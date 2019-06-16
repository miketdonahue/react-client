import { ApolloClient } from 'apollo-client';
import { from } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import merge from 'deepmerge';
import { httpMiddleware, authMiddleware } from '../middleware';
import defaultState from './default-state';
import { fileLoader } from '../../utils/webpack-file-loader';
import mergeResolvers from '../../utils/merge-resolvers';

// Register types and resolvers
const typeFiles = require.context('../models', true, /types\/.*.graphql$/);
const resolverFiles = require.context('../models', true, /resolvers\/.*.ts$/);
const typesArray = fileLoader(typeFiles);
const resolversArray = fileLoader(resolverFiles);
const resolvers = mergeResolvers(resolversArray);

interface Metadata {
  cookies?: object | string;
}

let apolloClient = null;

const createApolloClient = (initialState, { cookies }: Metadata): any => {
  const state: any = merge({ ...initialState }, defaultState({ cookies }));
  const cache = new InMemoryCache();

  // Load initial state into cache
  cache.writeData({ data: { ...state } });

  const client = new ApolloClient({
    name: 'web',
    ssrMode: !process.browser,
    link: from([authMiddleware, httpMiddleware]),
    cache,
    typeDefs: [...typesArray], // extends server types
    resolvers,
  });

  return client;
};

export default function initApollo(initialState, { cookies }: Metadata): any {
  // Create a new Apollo Client for every server-side request
  // so data is not shared between connections
  if (!process.browser) {
    console.log('init apollo server side');
    return createApolloClient(initialState, { cookies });
  }

  // Ensure Apollo Client is reused client-side for continued
  // access to the cache
  if (!apolloClient) {
    console.log('init apollo client side');
    apolloClient = createApolloClient(initialState, { cookies });
  }

  console.log('continue with apollo');
  return apolloClient;
}
