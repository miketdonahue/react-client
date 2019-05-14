import path from 'path';
import express from 'express';
import next from 'next';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import config from 'config';
import healthCheck from 'express-healthcheck';
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import { fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas';
import { applyMiddleware } from 'graphql-middleware';
import { prisma } from './prisma/generated/prisma-client';
import { normalizeError } from './modules/errors';
import logger from './modules/logger';
import requestLogger from './middleware/request-logger';
import resolverLogger from './middleware/resolver-logger';
import access from './middleware/access';
import validations from './middleware/validations';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const typesDir = path.join(__dirname, config.get('server.dirs.types'));
const resolversDir = path.join(__dirname, config.get('server.dirs.resolvers'));

// Register types and resolvers
const typesArray = fileLoader(typesDir);
const resolversArray = fileLoader(resolversDir);
const typeDefs = mergeTypes(typesArray, { all: true });
const resolvers = mergeResolvers(resolversArray);

// GraphQL schemas, middleware, and server setup
const graphqlSchema = makeExecutableSchema({
  typeDefs,
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
  playground: config.get('server.graphql.playground'),
  debug: config.get('server.graphql.debug'),
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
    const host = config.get('server.host');
    const port = config.get('server.port');

    server.use(helmet());
    server.use(helmet.referrerPolicy({ policy: 'same-origin' }));
    server.use(requestLogger());
    server.use('/health-check', healthCheck());
    server.use(cookieParser());
    server.use(csurf({ cookie: true }));
    server.use(
      helmet.contentSecurityPolicy({
        directives: config.get('server.contentSecurityPolicy'),
      })
    );

    // Apply Express middleware to GraphQL server
    apollo.applyMiddleware({
      app: server,
      path: config.get('server.graphql.path'),
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
