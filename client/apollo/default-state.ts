import Cookies from 'universal-cookie';
import jwt from 'jsonwebtoken';
import config from '@config';

const defaultState = (data): any => {
  const cookies = new Cookies(data.cookies);
  const token = cookies.get('jwt');
  let isAuthenticated = false;

  return jwt.verify(token, config.server.auth.jwt.secret, (err, decoded) => {
    if (decoded) {
      isAuthenticated = true;
    }

    return {
      app: {
        isAuthenticated,
        __typename: 'CacheApp',
      },
    };
  });
};

export default defaultState;
