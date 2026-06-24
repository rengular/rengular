import { inject } from "@angular/core";
import {
  httpResource,
  HttpResourceOptions,
  HttpResourceRef,
} from "@angular/common/http";

import { SERVER_LOCATION } from "./http.service";
import { buildResourceUrlFactory, RengEndpoint } from "./url";

/**
 * A base-URL-aware wrapper around Angular's `httpResource`. The `endpoint` is
 * relative to the configured `SERVER_LOCATION` (absolute URLs bypass the base),
 * and the returned `HttpResourceRef` exposes the usual `value()`, `status()`,
 * `error()` and `reload()` signals.
 *
 * Must be called in an injection context.
 *
 * @param endpoint endpoint relative to `SERVER_LOCATION`, or a reactive function returning one.
 * @param options the standard `httpResource` options (`parse`, `defaultValue`, …).
 */
export function rengHttpResource<TResult = unknown>(
  endpoint: RengEndpoint,
  options?: HttpResourceOptions<TResult, unknown>
): HttpResourceRef<TResult | undefined> {
  const url = buildResourceUrlFactory(inject(SERVER_LOCATION), endpoint);
  return httpResource<TResult>(url, options);
}
