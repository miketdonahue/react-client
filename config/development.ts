export default {
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
    },
  },
};
