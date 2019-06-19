import { oauth } from '@server/middleware';

export default [
  {
    route: '/oauth/google',
    controller: oauth.google.authorize,
  },
  {
    route: '/oauth/google/callback',
    middleware: [oauth.google.verify()],
    controller: oauth.google.authenticate,
  },
];
