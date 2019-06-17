import { ApolloClient } from 'apollo-client';
import { from } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { httpMiddleware, authMiddleware } from '../middleware';
import { fileLoader } from '../../utils/webpack-file-loader';
import mergeResolvers from '../../utils/merge-resolvers';

// Register types and resolvers
const typeFiles = require.context('../models', true, /types\/.*.graphql$/);
const resolverFiles = require.context('../models', true, /resolvers\/.*.ts$/);
const typesArray = fileLoader(typeFiles);
const resolversArray = fileLoader(resolverFiles);
const resolvers = mergeResolvers(resolversArray);

let apolloClient = null;

const createApolloClient = (initialState, { cookies }): any => {
  const client = new ApolloClient({
    name: 'web',
    ssrMode: !process.browser,
    link: from([authMiddleware(cookies), httpMiddleware]),
    cache: new InMemoryCache().restore(initialState || {}),
    typeDefs: [...typesArray], // extends server types
    resolvers,
  });

  return client;
};

export default function initApollo(initialState, metaData): any {
  // Create a new Apollo Client for every server-side request
  // so data is not shared between connections
  if (!process.browser) {
    return createApolloClient(initialState, metaData);
  }

  // Ensure Apollo Client is reused client-side for continued
  // access to the cache
  if (!apolloClient) {
    apolloClient = createApolloClient(initialState, metaData);
  }

  return apolloClient;
}
