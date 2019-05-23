import path from 'path';
import express from 'express';
import next from 'next';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import healthCheck from 'express-healthcheck';
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import { applyMiddleware } from 'graphql-middleware';
import { prisma } from './prisma/generated/prisma-client';
import { normalizeError } from './modules/errors';
import logger from './modules/logger';
import requestLogger from './middleware/request-logger';
import resolverLogger from './middleware/resolver-logger';
import access from './middleware/access';
import validations from './middleware/validations';
import fileLoader from '../utils/node-file-loader';
import mergeResolvers from '../utils/merge-resolvers';
import config from '@config';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const typesDir = path.join(__dirname, config.server.dirs.types);
const resolversDir = path.join(__dirname, config.server.dirs.resolvers);

// Register types and resolvers
const typesArray = fileLoader(typesDir);
const resolversArray = fileLoader(resolversDir);
const resolvers = mergeResolvers(resolversArray);

// Set up root types
const rootTypes = `
  type Query { root: String }
  type Mutation { root: String }
  type Subscription { root: String }
`;

// GraphQL schemas, middleware, and server setup
const graphqlSchema = makeExecutableSchema({
  typeDefs: [rootTypes, ...typesArray],
  resolvers,
});

const schema = applyMiddleware(
  graphqlSchema,
  resolverLogger,
  access,
  validations
);

const apollo = new ApolloServer({
  schema,
  context: ({ req, res }) => ({
    req,
    res,
    prisma,
  }),
  playground: config.server.graphql.playground,
  debug: config.server.graphql.debug,
  formatError: error => {
    const err = error;
    const { code, level } = normalizeError(err);

    // Ensures a more descriptive "code" is set for every error
    err.extensions.code = code;

    logger[level]({ err }, `${err.name}: ${err.message}`);
    return err;
  },
});

app
  .prepare()
  .then(() => {
    const server = express();
    const { host, port } = config.server;

    server.use(helmet());
    server.use(helmet.referrerPolicy({ policy: 'same-origin' }));
    server.use(requestLogger());
    server.use('/health-check', healthCheck());
    server.use(cookieParser());
    server.use(
      helmet.contentSecurityPolicy({
        directives: config.server.contentSecurityPolicy,
      })
    );

    if (!dev) {
      server.use(csrf({ cookie: true }));
    }

    // Apply Express middleware to GraphQL server
    apollo.applyMiddleware({
      app: server,
      path: config.server.graphql.path,
      cors: {
        origin: 'http://localhost:8080',
        credentials: true,
        optionsSuccessStatus: 200,
      },
      bodyParserConfig: true,
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen({ port }, err => {
      if (err) throw err;

      logger.info(
        {
          host,
          port,
          env: process.env.NODE_ENV || 'development',
        },
        `Server has been started @ ${host}:${port}`
      );
    });
  })
  .catch(err => {
    logger.error({ err }, 'Next.js failed to start');
    process.exit(1);
  });
