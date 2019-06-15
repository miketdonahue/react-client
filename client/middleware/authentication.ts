import { ApolloLink } from 'apollo-link';
import Cookies from 'universal-cookie';

export const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => {
    const cookies = new Cookies();
    const jwtToken = cookies.get('jwt');
    const csrfToken = cookies.get('csrf');

    return {
      headers: {
        ...headers,
        authorization: jwtToken ? `Bearer ${jwtToken}` : null,
        'CSRF-Token': csrfToken || null,
      },
    };
  });

  if (forward) {
    return forward(operation);
  }

  return null;
});
