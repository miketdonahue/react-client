import pino from 'pino';
import path from 'path';
import uuid from 'uuid/v4';
import config from '@config';

let destination = path.join(process.cwd(), 'server/logs/app.log');

if (process.env.NODE_ENV !== 'production') {
  destination = pino.destination(1);
}

/**
 * Creates a default logger instance
 *
 * @returns {Function} - Pino logger instance
 */
const defaultLogger = pino(
  {
    name: 'graphql-server',
    level: config.server.logger.level,
    enable: config.server.logger.enabled,
    redact: {
      paths: [],
      remove: true,
    },
    prettyPrint: config.server.logger.pretty,
  },
  destination
);

/**
 * Creates a child instance of the default logger
 *
 * @returns {Function} - Pino child logger instance
 */
const logger = defaultLogger.child({
  serializers: {
    req: req => {
      if (!req) {
        return false;
      }

      const whitelistedHeaders = (): any => {
        const headers = Object.assign({}, req.headers);

        if (config.server.logger.level !== 'debug') {
          delete headers.authorization;
          delete headers.cookie;
          delete headers['csrf-token'];
        }

        return headers;
      };

      return {
        id: uuid(),
        query: req.query,
        params: req.params,
        method: req.method,
        url: req.url,
        body: req.body,
        headers: whitelistedHeaders(),
        httpVersion: req.httpVersion,
        ip: req.ip,
      };
    },
    res: res => {
      if (!res) {
        return false;
      }

      return {
        statusCode: res.statusCode,
        headers: res._headers,
      };
    },
    args: args => {
      const whitelistArgs = Object.assign({}, { ...args.input });

      delete whitelistArgs.firstName;
      delete whitelistArgs.lastName;
      delete whitelistArgs.email;
      delete whitelistArgs.password;
      delete whitelistArgs.answers;

      return { ...whitelistArgs };
    },
  },
});

export default logger;
