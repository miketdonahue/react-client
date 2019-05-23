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
  cookies?: object;
}

export default function initApollo(initialState, { cookies }: Metadata): any {
  const state: any = merge({ ...initialState }, defaultState({ cookies }));
  const cache = new InMemoryCache();

  // Load initial state into cache
  cache.writeData({ data: { ...state } });

  const apolloClient = new ApolloClient({
    name: 'web',
    ssrMode: !process.browser,
    link: from([authMiddleware, httpMiddleware]),
    cache,
    typeDefs: [...typesArray], // extends server types
    resolvers,
  });

  return apolloClient;
}
