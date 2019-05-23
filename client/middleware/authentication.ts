import { ApolloLink } from 'apollo-link';
import Cookies from 'universal-cookie';

export const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => {
    const cookies = new Cookies();
    const token = cookies.get('jwt');

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : null,
      },
    };
  });

  if (forward) {
    return forward(operation);
  }

  return null;
});
