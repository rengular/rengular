# Angular HTTP library

An Angular HTTP library that extends `HttpClient` with a configured default
server location, convenience request methods, and a base-URL-aware wrapper around
the signal-based [`httpResource`](https://angular.dev/guide/http/http-resource).
Supports **Angular 19.2 → 22**.

## What the library provides

- Requests executed against a provided **default server location** (base URL).
- `HttpService.Get/Post/Put/Delete/Patch` convenience methods (prepend the base URL,
  accept an absolute `api` override).
- `rengHttpResource()` / `HttpService.resource()` — reactive, signal-based HTTP via
  Angular's `httpResource`, with the base URL applied automatically.
- The `SERVER_LOCATION` injection token.
- Fully standalone- and **zoneless**-ready.

Because the library is built on top of `HttpClient`, all `HttpClient` functionality
(interceptors, testing, etc.) is available as well.

## Requirements

- Angular `19.2`, `20`, `21`, or `22` (`@angular/core`, `@angular/common`).
- `httpResource` (and the `rengHttpResource` / `HttpService.resource` APIs) requires
  Angular **≥ 19.2**, where it shipped experimentally; it is stable from Angular 22.
  The imperative `HttpService` methods work on the whole range.

## How to install

```bash
npm i @rengular/http --save
```

## Setup (standalone)

Provide Angular's `HttpClient` and Rengular's HTTP support in your application config:

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

> Using NgModules? `RengHttpModule.forRoot('https://example.com/')` still works and
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
    this.http.Get('api/users').subscribe((users) => console.log(users));
  }

  create() {
    // POST https://example.com/api/users
    this.http.Post('api/users', { name: 'Ada' }).subscribe();
  }

  rename() {
    // PATCH https://example.com/api/users/1
    this.http.Patch('api/users/1', { name: 'Ada L.' }).subscribe();
  }
}
```

Each method (`Get`, `Post`, `Put`, `Delete`, `Patch`) takes an `endPoint` relative to
the server location, and an optional final `api` argument — an absolute URL that
bypasses the base, for one-off calls to a different backend.

## Reactive requests — `rengHttpResource`

`rengHttpResource` mirrors Angular's `httpResource` but prepends the configured server
location. It returns an `HttpResourceRef` whose `value()`, `status()`, `error()` and
`isLoading()` are signals, and which **re-fetches automatically** when a signal it
reads changes.

```ts
import { Component, signal } from '@angular/core';
import { rengHttpResource } from '@rengular/http';

interface User { id: number; name: string; }

@Component({
  selector: 'app-users',
  template: `
    @if (users.isLoading()) { <p>Loading…</p> }
    @for (user of users.value() ?? []; track user.id) {
      <li>{{ user.name }}</li>
    }
    <button (click)="page.set(page() + 1)">Next page</button>
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

`rengHttpResource` must be called in an injection context (e.g. a field initializer).
If you already hold an `HttpService`, `http.resource(...)` does the same thing and can
be called anywhere, since it reuses the service's own injector. Absolute endpoints
(`https://…`) bypass the base URL; an empty/`undefined` endpoint keeps the resource idle.

## Reading the server location

```ts
import { inject } from '@angular/core';
import { SERVER_LOCATION } from '@rengular/http';

const serverLocation = inject(SERVER_LOCATION);
```

## Migrating from v1 (Angular 13)

- The package now supports Angular `19.2`–`22`; its version is aligned with the
  Angular major (`22.x`).
- `RengHttpModule.forRoot(url)` and `HttpService` keep the same API — no code change
  required beyond upgrading Angular.
- New code should prefer `provideRengHttp(url)` and `rengHttpResource()`.
- `HttpClientModule` is no longer imported by the library; provide `provideHttpClient()`
  in your app (as shown above).
