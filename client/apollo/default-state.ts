import Cookies from 'universal-cookie';

const defaultState = (data): any => {
  const cookies = new Cookies(data.cookies);

  return {
    app: {
      isAuthenticated: !!cookies.get('jwt'),
      __typename: 'CacheApp',
    },
  };
};

export default defaultState;
