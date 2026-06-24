import { EnvironmentProviders, makeEnvironmentProviders } from "@angular/core";

import { HttpService, SERVER_LOCATION } from "./http.service";

/**
 * Registers Rengular's HTTP support for a standalone application.
 *
 * Provide it alongside Angular's own `provideHttpClient()`:
 *
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideHttpClient(),
 *     provideRengHttp('https://example.com/'),
 *   ],
 * });
 * ```
 *
 * @param serverLocation default base URL prepended to every relative endpoint.
 */
export function provideRengHttp(
  serverLocation: string
): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: SERVER_LOCATION, useValue: serverLocation },
    HttpService,
  ]);
}
