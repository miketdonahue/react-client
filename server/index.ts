import path from 'path';
import express from 'express';
import next from 'next';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
// import bodyParser from 'body-parser';
// import csrf from 'csurf';
import config from '@config';
import healthCheck from 'express-healthcheck';
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import { applyMiddleware } from 'graphql-middleware';
import { prisma } from './prisma/generated/prisma-client';
import { normalizeError } from './modules/errors';
import logger from './modules/logger';
import fileLoader from '../utils/node-file-loader';
import mergeResolvers from '../utils/merge-resolvers';
import {
  oauth,
  access,
  validations,
  requestLogger,
  resolverLogger,
} from './middleware';

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
    // server.use(bodyParser.urlencoded({ extended: false }));
    // server.use(csrf({ cookie: { key: 's_csrf' } }));
    server.use(
      helmet.contentSecurityPolicy({
        directives: config.server.contentSecurityPolicy,
      })
    );

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

    server.get('/oauth/google', oauth.google.authorize);
    server.get(
      '/oauth/google/callback',
      oauth.google.verify(),
      oauth.google.authenticate
    );

    server.get('*', (req, res) => {
      // Set a CSRF cookie on every get request
      // res.cookie('csrf', req.csrfToken());

      return handle(req, res);
    });

    const serverInstance = server.listen(port, () => {
      logger.info(
        {
          host,
          port,
          env: process.env.NODE_ENV || 'development',
        },
        `Server has been started @ ${host}:${port}`
      );
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        logger.info('Server address in use, retrying to start...');

        setTimeout(() => {
          serverInstance.close();
          server.listen(port, () => {
            logger.info(
              {
                host,
                port,
                env: process.env.NODE_ENV || 'development',
              },
              `Server has been started @ ${host}:${port}`
            );
          });
        }, 1000);
      }

      throw err;
    });
  })
  .catch(err => {
    logger.error({ err }, 'Next.js failed to start');
    process.exit(1);
  });
