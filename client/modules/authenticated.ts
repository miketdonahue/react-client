import Cookies from 'universal-cookie';
import * as queries from '@pages/login/graphql/queries.graphql';
import { redirectTo } from './redirect';

export const checkAuthentication = async (ctx): Promise<any> => {
  const { apolloClient, req, pathname } = ctx;
  const urlPathname = process.browser ? pathname : req.url;
  const universalCookies = process.browser
    ? document.cookie
    : req.headers.cookie;
  const cookies = new Cookies(universalCookies);
  const token = cookies.get('jwt') || '';

  const {
    data: { isAuthenticated },
  } = await apolloClient.query({
    query: queries.isAuthenticated,
    variables: { input: { token } },
  });

  if (urlPathname === '/login' && isAuthenticated) {
    return redirectTo(ctx, '/');
  }

  if (urlPathname !== '/login' && !isAuthenticated) {
    return redirectTo(ctx, '/login');
  }

  return undefined;
};
