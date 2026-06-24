# @rengular/http

[![npm version](https://img.shields.io/npm/v/@rengular/http.svg)](https://www.npmjs.com/package/@rengular/http)
[![Angular](https://img.shields.io/badge/Angular-19.2%20–%2022-dd0031.svg)](https://angular.dev)
[![license](https://img.shields.io/npm/l/@rengular/http.svg)](../../LICENSE)

A thin, type-safe layer over Angular's `HttpClient` that gives you a **configured
base URL**, ergonomic request helpers, and a base-URL-aware wrapper around the
signal-based [`httpResource`](https://angular.dev/guide/http/http-resource).

Stop repeating `environment.apiUrl + '/users'` in every call — configure the server
location once and request relative endpoints everywhere.

```ts
// before
this.http.get(`${environment.apiUrl}/users/${id}`);

// after
this.http.Get(`users/${id}`);
// or, reactively:
users = rengHttpResource<User[]>(() => `users?page=${this.page()}`);
```

## Features

- 🌐 **Default server location** — set the base URL once via `provideRengHttp(url)`.
- ✋ **Imperative helpers** — `Get` / `Post` / `Put` / `Delete` / `Patch`, each with an
  absolute-URL `api` override for one-off calls to a different backend.
- ⚡ **Reactive resources** — `rengHttpResource()` / `HttpService.resource()` return
  signal-based `HttpResourceRef`s that auto-refetch when their dependencies change.
- 🧩 **Standalone-first** — `provideRengHttp()`, with `RengHttpModule.forRoot()` kept
  for backward compatibility.
- 🪶 **Zoneless-ready** — built entirely on signals and `HttpClient`; no Zone.js needed.
- 🧱 **Still just `HttpClient`** — `HttpService extends HttpClient`, so interceptors,
  testing utilities, and every other `HttpClient` feature keep working.

## Compatibility

| Angular | `HttpService` (Get/Post/Put/Delete/Patch) | `rengHttpResource` / `HttpService.resource` |
| ------- | :---------------------------------------: | :-----------------------------------------: |
| 19.2 – 21 | ✅ | ✅ (`httpResource` is experimental in this range) |
| 22      | ✅ | ✅ (`httpResource` is stable) |

`httpResource` shipped in Angular **19.2**, so the resource APIs require `≥ 19.2`.

## Install

```bash
npm i @rengular/http
```

## Setup

Provide Angular's `HttpClient` and Rengular's HTTP support in your app config:

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRengHttp } from '@rengular/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRengHttp('https://example.com/'), // your default server location
  ],
});
```

> **NgModule app?** `RengHttpModule.forRoot('https://example.com/')` still works and
> simply delegates to `provideRengHttp` under the hood.

## Imperative requests — `HttpService`

```ts
import { Component, inject } from '@angular/core';
import { HttpService } from '@rengular/http';

@Component({ /* … */ })
export class UsersComponent {
  private readonly http = inject(HttpService);

  load() {
    // GET https://example.com/api/users
    this.http.Get<User[]>('api/users').subscribe((users) => console.log(users));
  }

  create() {
    // POST https://example.com/api/users
    this.http.Post<User>('api/users', { name: 'Ada' }).subscribe();
  }

  rename(id: number) {
    // PATCH https://example.com/api/users/1
    this.http.Patch<User>(`api/users/${id}`, { name: 'Ada L.' }).subscribe();
  }
}
```

Every method takes an `endPoint` relative to the server location, optional request
`options` (headers, params, etc.), and an optional final `api` argument — an absolute
URL that **bypasses the base URL** for a one-off call to a different backend:

```ts
this.http.Get<Rates>('latest', { headers }, 'https://api.exchange.com/v2/latest');
```

## Reactive requests — `rengHttpResource`

`rengHttpResource` mirrors Angular's `httpResource` but prepends the configured server
location. It returns an `HttpResourceRef` whose `value()`, `status()`, `error()`, and
`isLoading()` are signals, and which **re-fetches automatically** whenever a signal it
reads changes (cancelling any in-flight request first).

```ts
import { Component, signal } from '@angular/core';
import { rengHttpResource } from '@rengular/http';

interface User { id: number; name: string; }

@Component({
  selector: 'app-users',
  template: `
    @if (users.isLoading()) { <p>Loading…</p> }
    @if (users.error()) { <p class="error">Could not load users.</p> }

    <ul>
      @for (user of users.value() ?? []; track user.id) {
        <li>{{ user.name }}</li>
      }
    </ul>

    <button (click)="page.set(page() + 1)">Next page</button>
    <button (click)="users.reload()">Reload</button>
  `,
})
export class UsersComponent {
  protected readonly page = signal(1);

  // Re-issues GET https://example.com/api/users?page=N whenever `page` changes.
  protected readonly users = rengHttpResource<User[]>(
    () => `api/users?page=${this.page()}`
  );
}
```

Notes:

- `rengHttpResource` must run in an **injection context** (e.g. a field initializer).
  If you already hold an `HttpService`, `http.resource(...)` does the same thing and can
  be called anywhere, since it reuses the service's own injector.
- **Absolute** endpoints (`https://…`) bypass the base URL.
- An **empty/`undefined`** endpoint keeps the resource idle (no request) — handy for
  "don't fetch until a value is selected".

## API reference

| Export | Kind | Description |
| ------ | ---- | ----------- |
| `provideRengHttp(url)` | provider fn | Registers the server location and `HttpService`. Returns `EnvironmentProviders`. |
| `HttpService` | injectable | Extends `HttpClient`. `Get/Post/Put/Delete/Patch(endPoint, …, options?, api?)` + `resource(endPoint, options?)`. |
| `rengHttpResource<T>(endpoint, options?)` | function | Base-URL-aware `httpResource`. Returns `HttpResourceRef<T \| undefined>`. |
| `SERVER_LOCATION` | `InjectionToken<string>` | The configured base URL; `inject(SERVER_LOCATION)` to read it. |
| `RengEndpoint` | type | `string \| (() => string \| undefined)` — an endpoint relative to the base URL. |
| `IRequestOptions` | interface | Options accepted by the imperative methods (headers, params, …). |
| `RengHttpModule` | NgModule | Backward-compatible `forRoot(url)` wrapper over `provideRengHttp`. |

## Migrating from v1 (Angular 13)

- The package now supports Angular `19.2`–`22`; its version is aligned with the
  Angular major (`22.x`).
- `RengHttpModule.forRoot(url)` and `HttpService` keep the same API — no code change is
  required beyond upgrading Angular.
- New code should prefer `provideRengHttp(url)` and `rengHttpResource()`.
- `HttpClientModule` is no longer imported by the library; provide `provideHttpClient()`
  in your app (as shown above).

## License

[MIT](../../LICENSE)
