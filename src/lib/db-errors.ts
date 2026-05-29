import { Prisma } from '@prisma/client';

export type DbErrorKind = 'connection' | 'auth' | 'not_found' | 'validation' | 'unknown';

export interface ClassifiedError {
  kind: DbErrorKind;
  /** HTTP status to surface from API routes */
  status: number;
  /** Short user-facing message */
  message: string;
}

/**
 * Classify an unknown error so callers (API routes, error boundaries) can react
 * appropriately without leaking stack traces. We distinguish "service is currently
 * unreachable" (retryable) from "something is wrong with the request" (not retryable).
 */
export function classifyError(err: unknown): ClassifiedError {
  // Prisma can't reach the database — pooler/network/instance asleep
  if (err instanceof Prisma.PrismaClientInitializationError) {
    return {
      kind: 'connection',
      status: 503,
      message: 'Database is temporarily unreachable. Please try again in a moment.',
    };
  }

  // Known request error — e.g. unique constraint, record not found
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      return { kind: 'not_found', status: 404, message: 'Record not found.' };
    }
    return {
      kind: 'validation',
      status: 400,
      message: 'The request could not be completed.',
    };
  }

  // Network / fetch level — message-sniff for the common cases. Lower priority than the typed checks above.
  const msg = err instanceof Error ? err.message : String(err ?? '');
  if (/can't reach database|ECONNREFUSED|ETIMEDOUT|ENOTFOUND|ECONNRESET/i.test(msg)) {
    return {
      kind: 'connection',
      status: 503,
      message: 'Database is temporarily unreachable. Please try again in a moment.',
    };
  }
  if (/password authentication failed|SASL/i.test(msg)) {
    return {
      kind: 'auth',
      status: 503,
      message: 'Database credentials are misconfigured.',
    };
  }

  return { kind: 'unknown', status: 500, message: 'An unexpected error occurred.' };
}

/** True if the error looks like a transient connectivity failure (worth retrying). */
export function isConnectionError(err: unknown): boolean {
  return classifyError(err).kind === 'connection';
}
