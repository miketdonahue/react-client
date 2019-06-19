const merge = require('deepmerge');
const defaultConfig = require('./default');

module.exports = merge(defaultConfig, {
  server: {
    host: 'http://localhost',
    logger: {
      level: 'debug',
      pretty: true,
    },
    graphql: {
      playground: true,
      debug: true,
      logger: true,
    },
    auth: {
      enabled: true,
      confirmable: true,
      lockable: {
        enabled: false,
      },
    },
    mailer: {
      sendEmails: false,
    },
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        'cdn.jsdelivr.net',
      ],
      styleSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
      fontSrc: ["'self'", 'data:'],
      imgSrc: [
        "'self'",
        'data:',
        'cdn.jsdelivr.net',
        'graphcool-playground.netlify.com',
      ],
      connectSrc: ["'self'", 'devtools.apollodata.com'],
    },
    dirs: {
      types: 'models/**/types/*.graphql',
      resolvers: 'models/**/resolvers/*.ts',
      routes: 'pages/**/routes.ts',
      access: 'server/models/**/access.ts',
      validations: 'server/models/**/validations.ts',
    },
  },
});
