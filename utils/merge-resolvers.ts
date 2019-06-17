import merge from 'deepmerge';

export default (resolvers): any =>
  resolvers.length === 1 ? resolvers[0] : merge.all(resolvers);
