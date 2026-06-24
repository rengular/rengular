/**
 * Pure URL helpers shared by the observable and resource APIs. No Angular
 * dependencies so both `http.service.ts` and `http.resource.ts` can import them
 * without creating a circular reference.
 */

/** An endpoint relative to the configured server location, or a reactive function returning one. */
export type RengEndpoint = string | (() => string | undefined);

/** True when `url` already carries a scheme (`https://…`) or is protocol-relative (`//…`). */
export function isAbsoluteUrl(url: string): boolean {
  return /^[a-z][a-z\d+.-]*:\/\//i.test(url) || url.startsWith("//");
}

/** Prepend `base` to `endpoint` unless the endpoint is already absolute. */
export function composeUrl(base: string, endpoint: string): string {
  return isAbsoluteUrl(endpoint) ? endpoint : base + endpoint;
}

/**
 * Build the reactive URL function `httpResource` expects: resolves the endpoint
 * (string or signal-reading function) and composes it against `base`. Returns
 * `undefined` for an empty endpoint so the resource stays idle.
 */
export function buildResourceUrlFactory(
  base: string,
  endpoint: RengEndpoint
): () => string | undefined {
  return () => {
    const resolved = typeof endpoint === "function" ? endpoint() : endpoint;
    if (resolved == null || resolved === "") {
      return undefined;
    }
    return composeUrl(base, resolved);
  };
}
