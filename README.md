# Rengular

[![license](https://img.shields.io/npm/l/@rengular/http.svg)](./LICENSE)
[![Angular](https://img.shields.io/badge/Angular-22-dd0031.svg)](https://angular.dev)

A small collection of **reusable Angular modules**, developed in an Angular 22
workspace (esbuild application builder, Vitest, zoneless) and published under the
[`@rengular`](https://www.npmjs.com/org/rengular) scope.

## Packages

| Package | Description | Angular |
| ------- | ----------- | ------- |
| [`@rengular/http`](./projects/http/README.md) | `HttpClient` with a configured base URL, request helpers, and a base-URL-aware `httpResource` wrapper. | 19.2 – 22 |

Each package is independent — install only what you need:

```bash
npm i @rengular/http
```

## Repository layout

```
projects/
  http/         # @rengular/http library (published)
  playground/   # standalone + zoneless demo app that consumes the libraries
```

## Local development

### Prerequisites

- **Node.js** `≥ 22.22.3` or `≥ 24.15` (required by the Angular 22 CLI; see
  [`.nvmrc`](./.nvmrc) — run `nvm use`).
- **npm** `≥ 8`.

### Setup

```bash
npm install
```

### Common tasks

| Command | What it does |
| ------- | ------------ |
| `npm start` | Serve the `playground` demo app at `http://localhost:4200`. |
| `npm run build:http` | Build `@rengular/http` to `dist/rengular/http` (ng-packagr). |
| `npm test` | Run the unit tests (Vitest). |
| `ng test http` / `ng test playground` | Run tests for a single project. |
| `ng build http --configuration production` | Produce the publishable (partial-compiled) package. |

### Publishing a package

```bash
ng build http --configuration production
cd dist/rengular/http
npm publish --access public
```

## Contributing

Contributions are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md). In short: fork,
branch, write a clear commit message, and open a pull request.

## License

[MIT](./LICENSE) © Bogdan Bogdanov
