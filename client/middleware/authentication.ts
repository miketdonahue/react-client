import { ApolloLink } from 'apollo-link';
import Cookies from 'universal-cookie';

export const authMiddleware = (cookies): any =>
  new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => {
      const cookie = new Cookies(cookies());
      const jwtToken = cookie.get('jwt');
      // const csrfToken = cookie.get('csrf');

      return {
        headers: {
          ...headers,
          authorization: jwtToken ? `Bearer ${jwtToken}` : null,
          // 'CSRF-Token': csrfToken,
        },
      };
    });

    if (forward) {
      return forward(operation);
    }

    return null;
  });
