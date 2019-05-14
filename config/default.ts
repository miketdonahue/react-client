export default {
  client: {
    dirs: {
      types: 'pages/**/types/*.graphql',
      resolvers: 'pages/**/resolvers/*.ts',
    },
  },
  server: {
    port: process.env.PORT || 8080,
    graphql: {
      path: '/graphql',
      playground: false,
      debug: false,
      logger: false,
    },
    auth: {
      enabled: true,
      confirmable: true,
      jwt: {
        secret: process.env.JWT_SECRET,
        expireTime: '1h',
      },
      codes: {
        // time in minutes
        expireTime: {
          confirmed: 8 * 60,
          passwordReset: 30,
          locked: 15,
        },
      },
      lockable: {
        enabled: true,
        maxAttempts: 5,
      },
      securityQuestions: {
        number: 3,
      },
    },
    mailer: {
      sendEmails: true,
    },
    logger: {
      enabled: true,
      level: 'info',
      pretty: false,
    },
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
    },
    dirs: {
      types: 'models/**/types/*.graphql',
      resolvers: 'models/**/resolvers/*.ts',
      access: 'server/models/**/access.ts',
      validations: 'server/models/**/validations.ts',
    },
  },
};
