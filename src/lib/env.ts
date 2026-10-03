import "server-only";
import { z } from "zod";

const MIN_SESSION_SECRET_LENGTH = 32;

const serverEnvSchema = z.object({
  SESSION_SECRET: z.string().min(MIN_SESSION_SECRET_LENGTH, `must be at least ${MIN_SESSION_SECRET_LENGTH} characters`),
  // The NestJS backend (api/): mints/verifies the same SESSION_SECRET-signed JWT this app stores as its cookie.
  NEST_API_URL: z.string().url("must be a valid URL"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

/**
 * Validates the server-side variables. The error names each offending variable and why, but never echoes a
 * value, so a misconfigured secret cannot end up in logs.
 */
export function parseServerEnv(source: Record<string, string | undefined>): ServerEnv {
  const result = serverEnvSchema.safeParse(source);
  if (result.success) return result.data;

  const problems = result.error.issues.map((issue) => `${issue.path.join(".")} ${issue.message}`);
  throw new Error(`Invalid server environment: ${problems.join("; ")}`);
}

let cached: ServerEnv | undefined;

/** Lazy and memoised: fails on first use with a clear message instead of at module load or build time. */
export function getServerEnv(): ServerEnv {
  cached ??= parseServerEnv(process.env);
  return cached;
}
