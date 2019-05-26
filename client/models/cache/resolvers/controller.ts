import Cookies from 'universal-cookie';

const setIsLoggedIn = async (parent, args, context, info): Promise<any> => {
  const cookies = new Cookies();
  cookies.set('jwt', args.input.token, { path: '/' });

  return context.cache.writeData({
    data: { app: { isAuthenticated: true, __typename: 'CacheApp' } },
  });
};

// const setLoggedOut = async (parent, args, context, info): Promise<any> => {
//   return context.cache.writeData({ data: { isAuthenticated: false } });
// };

export default {
  Mutation: {
    setIsLoggedIn,
  },
};
