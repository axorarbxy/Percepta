import type { MiddlewareHandler } from 'hono';

/**
 * Request logger middleware.
 * Logs method, path, status code, and duration in ms per request.
 */
export const logger = (): MiddlewareHandler => {
  return async (c, next) => {
    const start = performance.now();
    const { method, path } = c.req;

    await next();

    const duration = (performance.now() - start).toFixed(2);
    const status = c.res.status;

    // Use emoji indicator based on HTTP status
    const statusSymbol = status >= 500 ? '🔥' : status >= 400 ? '⚠️' : '✨';

    console.log(
      `${statusSymbol} [${method}] ${path} -> ${status} (${duration}ms)`
    );
  };
};
