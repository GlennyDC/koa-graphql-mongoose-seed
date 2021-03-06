import { createNamespace } from 'cls-hooked';
import type Koa from 'koa';

import { generateSemiUniqueId } from '../generateSemiUniqueId';

const loggingNamespace = createNamespace('logging');

/**
 * This middleware is responsible for the automagically creation of correlated
 * request ids. Upon every request a unique request id is generated and
 * attached to the logging namespace. When something is logged the request id
 * is taken from the logging namespace and added to the log.
 *
 * Note: The automagically generation of correlation ids is based upon the
 * experimental Async Hooks API of Node. This comes at a performance and
 * reliability cost. Use with caution.
 *
 * @see {@link https://nodejs.org/api/async_hooks.html|Node Async Hooks}
 */
export const createLoggingMiddleware = (): Koa.Middleware => {
  return async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
    await new Promise(
      loggingNamespace.bind((resolve, reject) => {
        loggingNamespace.set('requestId', generateSemiUniqueId());
        loggingNamespace.bindEmitter(ctx.req);
        loggingNamespace.bindEmitter(ctx.res);

        next().then(resolve).catch(reject);
      }),
    );
  };
};
