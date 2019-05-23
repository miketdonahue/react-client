import config from '@config';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';

const { host, port, graphql } = config.server;

export const httpMiddleware = createHttpLink({
  uri: `${host}:${port}${graphql.path}`,
  credentials: 'same-origin',
  fetch,
});
