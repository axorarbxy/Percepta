import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';
import { AppError, type ErrorCode, type ErrorResponse } from '../lib/errors.js';

/**
 * Global error handler (Hono v5 pattern: accesses error via c.error).
 * Maps known error types (ZodError, HTTPException, AppError) to the standard error envelope.
 * Logs stack traces to console and guarantees internal errors are never leaked to clients.
 */
export const errorHandler = (c: Context, err?: Error) => {
  const error = c.error || err;

  // 1. Custom AppError
  if (error instanceof AppError) {
    return c.json<ErrorResponse>(
      {
        ok: false,
        error: {
          code: error.code,
          message: error.message,
          ...(error.details !== undefined && { details: error.details }),
        },
      },
      error.statusCode as any
    );
  }

  // 2. Zod validation error
  if (error instanceof ZodError) {
    return c.json<ErrorResponse>(
      {
        ok: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          details: error.flatten(),
        },
      },
      400
    );
  }

  // 3. Hono HTTPException
  if (error instanceof HTTPException) {
    let code: ErrorCode = 'INTERNAL';
    if (error.status === 401) code = 'AUTH_REQUIRED';
    else if (error.status === 403) code = 'FORBIDDEN';
    else if (error.status === 404) code = 'NOT_FOUND';
    else if (error.status === 429) code = 'RATE_LIMITED';
    else if (error.status === 400) code = 'VALIDATION_ERROR';

    return c.json<ErrorResponse>(
      {
        ok: false,
        error: {
          code,
          message: error.message || 'Request failed',
        },
      },
      error.status
    );
  }

  // 4. Unknown/Internal errors
  // Log full error and stack trace to server console; never leak to client
  console.error('❌ [Unhandled Internal Error]:', error);

  return c.json<ErrorResponse>(
    {
      ok: false,
      error: {
        code: 'INTERNAL',
        message: 'Internal server error',
      },
    },
    500
  );
};
