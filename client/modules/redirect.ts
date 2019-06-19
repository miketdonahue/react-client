import Router from 'next/router';

export const redirectTo = (ctx, url): any => {
  if (ctx.res) {
    ctx.res.writeHead(302, { Location: url });
    return ctx.res.end();
  }

  return Router.replace(url);
};
