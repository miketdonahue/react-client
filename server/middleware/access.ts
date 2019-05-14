import config from 'config';
import path from 'path';
import { shield, deny } from 'graphql-shield';
import assign from 'assign-deep';
import { fileLoader } from 'merge-graphql-schemas';
import { InternalError } from '../modules/errors';

const permissionsArray = fileLoader(
  path.join(process.cwd(), config.get('server.dirs.access'))
);

/**
 * Create access permissions
 *
 * @function
 * @returns {Function} - A Shield function generator to be used as middleware
 */
export default shield(assign(...permissionsArray), {
  debug: config.get('server.graphql.debug'),
  fallbackRule: deny,
  fallbackError: new InternalError('UNAUTHORIZED'),
});
