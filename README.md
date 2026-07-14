# UI5 App + Library + FLP Plugin Monorepo (pnpm)

[![CI](https://github.com/mariokernich/ui5-monorepo-showcase/actions/workflows/ci.yml/badge.svg)](https://github.com/mariokernich/ui5-monorepo-showcase/actions/workflows/ci.yml)

A showcase of a **pnpm workspace monorepo** with three UI5 TypeScript projects that are
developed together — linked live via the `workspace:` protocol, no publishing, one
command to start everything, and a shared Fiori Launchpad sandbox that ties it all
together.

| Package                                            | Type                | Port    | Description                                                       |
| -------------------------------------------------- | ------------------- | ------- | ----------------------------------------------------------------- |
| [`packages/sample-app`](packages/sample-app)       | UI5 Application     | `8080`  | App `com.myorg.myapp`, consumes the library via workspace link    |
| [`packages/sample-lib`](packages/sample-lib)       | UI5 Library         | `8081`  | Control library `com.myorg.mylib` (TypeScript sources)            |
| [`packages/sample-plugin`](packages/sample-plugin) | FLP Shell Plugin    | `8082`  | Launchpad plugin `com.myorg.myplugin`, loaded by the shell itself |
| [`flpSandbox.html`](flpSandbox.html)               | Central FLP Sandbox | `8090`  | One launchpad that hosts the app as a tile and loads the plugin   |

All three packages were scaffolded with the [easy-ui5](https://github.com/ui5-community/generator-easy-ui5)
generators (`ts-app`, `ts-library`, `ts-flp-plugin`).

## Quick Start

```sh
pnpm install
pnpm start
```

`pnpm start` launches all four servers in parallel and opens the central launchpad at
<http://localhost:8090/flpSandbox.html> — the app and the library test page as tiles,
the plugin loaded by the shell itself.

## Scripts

| Command (from repo root)               | What it does                             |
| -------------------------------------- | ---------------------------------------- |
| `pnpm start`                           | Start all dev servers + the launchpad    |
| `pnpm -r run build`                    | Build every package (`ui5 build`)        |
| `pnpm -r run test`                     | Run lint + tests in every package        |
| `pnpm --filter com.myorg.myapp start`  | Start a single package                   |

## How it works

The full walkthrough — workspace linking, transpiling the linked TypeScript library,
cross-package type safety, the central FLP sandbox, and how to grow the workspace with
more projects — is covered in the accompanying blog post:

**[→ UI5 App, Library & FLP Plugin in One pnpm Monorepo](https://kernich.de/posts/ui5-monorepo-with-pnpm-workspaces/)**

## License

Apache-2.0 (see individual packages).
