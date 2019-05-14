import logger from '../modules/logger';

/**
 * Logs key information on every express request
 *
 * @function
 * @returns {Function} - Express next middleware promise
 */
const requestLogger = (): any => {
  return (req, res, next) => {
    if (req.url.startsWith('/_next')) return next();

    const startTime = process.hrtime();
    const originalResEnd = res.end;

    logger.info(
      {
        req,
        res,
      },
      'Start request'
    );

    res.end = (...args) => {
      const diffTime = process.hrtime(startTime);
      const responseTime = (diffTime[0] * 1e9 + diffTime[1]) / 1e6;

      logger.info(
        {
          responseTime: `${responseTime} ms`,
        },
        'End request'
      );

      originalResEnd.apply(res, args);
    };

    return next();
  };
};

export default requestLogger;
