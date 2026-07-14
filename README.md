# UI5 App + Library + FLP Plugin Monorepo (pnpm)

[![CI](https://github.com/mariokernich/ui5-monorepo-showcase/actions/workflows/ci.yml/badge.svg)](https://github.com/mariokernich/ui5-monorepo-showcase/actions/workflows/ci.yml)

A showcase of a **pnpm workspace monorepo** containing three UI5 TypeScript projects that
work together at development time — without publishing anything to a registry:

| Package                                    | Type                    | Dev Server Port | Description                                                        |
| ------------------------------------------ | ----------------------- | --------------- | ------------------------------------------------------------------ |
| [`packages/sample-app`](packages/sample-app)       | UI5 Application         | `8080`          | App `com.myorg.myapp`, consumes the library via workspace link     |
| [`packages/sample-lib`](packages/sample-lib)       | UI5 Library             | `8081`          | Control library `com.myorg.mylib` (TypeScript sources)             |
| [`packages/sample-plugin`](packages/sample-plugin) | FLP Shell Plugin        | `8082`          | Launchpad plugin `com.myorg.myplugin`, loaded by the shell itself  |
| [`flpSandbox.html`](flpSandbox.html)               | Central FLP Sandbox     | `8090`          | One launchpad that hosts the app as a tile and loads the plugin    |

```
ui5-monorepo-showcase/
├── package.json            ← root orchestration scripts
├── pnpm-workspace.yaml     ← workspace definition
├── flpSandbox.html         ← central Fiori Launchpad sandbox (port 8090)
└── packages/
    ├── sample-app/         ← UI5 app, depends on sample-lib
    ├── sample-lib/         ← UI5 library
    └── sample-plugin/      ← FLP shell plugin
```

## Quick Start

```sh
pnpm install
pnpm start
```

`pnpm start` launches **all four servers in parallel** and opens the central launchpad at
<http://localhost:8090/flpSandbox.html>:

- **Sample App** tile → app on `:8080` (embedded in an iframe, using the linked library)
- **Sample Lib** tile → library test page on `:8081`
- **Sample Plugin** → not a tile! It is loaded by the launchpad shell itself from `:8082`

---

## How it works

### 1. pnpm workspace & package linking

`pnpm-workspace.yaml` declares all packages:

```yaml
packages:
  - packages/*
```

The app consumes the library as a normal npm dependency using the
[`workspace:` protocol](https://pnpm.io/workspaces#workspace-protocol-workspace):

```jsonc
// packages/sample-app/package.json
{
  "dependencies": {
    "com.myorg.mylib": "workspace:*"
  }
}
```

`pnpm install` creates a **symlink**
`packages/sample-app/node_modules/com.myorg.mylib → ../../sample-lib`.
The UI5 tooling follows this symlink: because the linked package contains a `ui5.yaml`
of `type: library`, `ui5 serve`/`ui5 build` in the app treat it as a regular UI5
dependency (check with `ui5 tree`). No `npm pack`, no local registry, no manual
`resourceroots` hacks.

The library must also be declared in the app's `manifest.json` so the UI5 runtime
loads it:

```jsonc
// packages/sample-app/webapp/manifest.json
"sap.ui5": {
  "dependencies": {
    "libs": {
      "sap.ui.core": {},
      "sap.m": {},
      "com.myorg.mylib": {}
    }
  }
}
```

And for TypeScript code completion, the app's `tsconfig.json` maps the library
namespace directly to the workspace sibling's sources:

```jsonc
// packages/sample-app/tsconfig.json
"paths": {
  "com/myorg/mylib/*": ["../sample-lib/src/com/myorg/mylib/*"]
}
```

### 2. Transpiling the linked TypeScript library on the fly

Both projects are written in TypeScript and use
[`ui5-tooling-transpile`](https://www.npmjs.com/package/ui5-tooling-transpile).
By default the transpile **middleware only transpiles the root project** — requests for
`/resources/com/myorg/mylib/library.js` would hit the library's *TypeScript* sources and
404. The key setting is `transpileDependencies`:

```yaml
# packages/sample-app/ui5.yaml
server:
  customMiddleware:
    - name: ui5-tooling-transpile-middleware
      afterMiddleware: compression
      configuration:
        transpileDependencies: true   # ← transpile linked TS dependencies too
```

With this, the app's dev server serves the library's `.ts` sources as transpiled
JavaScript. (The option only affects `ui5 serve`; production builds transpile each
project with its own `ui5-tooling-transpile-task`.)

### 3. Root orchestration scripts

The root `package.json` starts everything with one command:

```jsonc
// package.json (root)
{
  "scripts": {
    "start": "run-p start:projects start:flp",
    "start:projects": "pnpm --recursive --parallel --stream run start",
    "start:flp": "http-server -p 8090 -c-1 --silent -o /flpSandbox.html ."
  },
  "devDependencies": {
    "http-server": "^14.1.1",
    "npm-run-all2": "^7.0.2"
  }
}
```

- `pnpm --recursive --parallel run start` runs the `start` script of **every workspace
  package** simultaneously (`--stream` prefixes the output with the package folder).
- `run-p` (from `npm-run-all2`) additionally runs the static `http-server` that serves
  the central `flpSandbox.html`.
- Each package's `start` script pins a **unique port** and does **not** open a browser —
  only the central FLP does (`-o /flpSandbox.html`):

```jsonc
// packages/sample-app/package.json
"start": "ui5 serve --port 8080"

// packages/sample-lib/package.json
"start": "ui5 serve --port 8081"

// packages/sample-plugin/package.json
"start": "ui5 serve --port 8082 --config ui5-test.yaml"
```

### 4. The central FLP sandbox

[`flpSandbox.html`](flpSandbox.html) bootstraps the classic Fiori Launchpad sandbox from
the SAPUI5 CDN and wires all three projects together via `window["sap-ushell-config"]`:

```js
window["sap-ushell-config"] = {
    defaultRenderer: "fiori2",

    // The FLP plugin: loaded by the SHELL itself, not started via tile
    bootstrapPlugins: {
        FLPPluginAll: {
            component: "com.myorg.myplugin",
            url: "http://localhost:8082/",
        },
    },

    // Apps that appear as tiles on the homepage
    applications: {
        "myapp-display": {
            title: "Sample App",
            applicationType: "URL",
            url: "http://localhost:8080/index.html",
        },
        "mylib-display": {
            title: "Sample Lib",
            applicationType: "URL",
            url: "http://localhost:8081/test-resources/com/myorg/mylib/Example.html",
        },
    },
};
```

```html
<!-- ushell sandbox bootstrap MUST come before the UI5 bootstrap -->
<script src="https://ui5.sap.com/test-resources/sap/ushell/bootstrap/sandbox.js"></script>
<script
    id="sap-ui-bootstrap"
    src="https://ui5.sap.com/resources/sap-ui-core.js"
    data-sap-ui-libs="sap.m, sap.ushell"
    data-sap-ui-theme="sap_horizon"
    data-sap-ui-async="true"
    data-sap-ui-compat-version="edge"
    data-sap-ui-frame-options="allow"
></script>
```

### 5. Iframe embedding & clickjacking protection

The tiles use `applicationType: "URL"`, so apps are embedded as **iframes from a
different origin** (`:8080` vs. `:8090`). UI5's frame options would normally block all
interaction (blocked cursor 🚫 + console error *"Embedding blocked because the allowlist
… is not configured correctly"*). Therefore the app's bootstrap allows embedding:

```html
<!-- packages/sample-app/webapp/index.html -->
<script
    id="sap-ui-bootstrap"
    ...
    data-sap-ui-frame-options="allow"
></script>
```

> ⚠️ `allow` disables clickjacking protection — fine for local development. In
> production use `trusted` plus an allowlist:
> `data-sap-ui-frame-options-config='{"allowlist": ["your-flp-host"]}'`.

### 6. The FLP plugin — loaded by the shell, not a tile

An FLP plugin (`"sap.flp": { "type": "plugin" }` in its `manifest.json`) has no UI of
its own; the launchpad shell loads its component at startup. That's what the
`bootstrapPlugins` entry above does: the sandbox fetches
`http://localhost:8082/manifest.json` + `Component.js` and executes the plugin inside
the shell (e.g. to add header buttons, footer content, …).

The plugin also ships its own standalone sandbox at
<http://localhost:8082/test/flpSandbox.html> (useful for isolated plugin development —
it additionally loads the RTA/personalization plugins).

### 7. Using a library control in the app (TypeScript, cross-package)

The library ships a custom control `com.myorg.mylib.GreetingCard` (control + renderer +
LESS theming + i18n texts), and the app consumes it directly in its XML view:

```xml
<!-- packages/sample-app/webapp/view/Main.view.xml -->
<mvc:View
    xmlns:mylib="com.myorg.mylib" ...>
    <mylib:GreetingCard name="UI5 Developer" press=".onGreetingPress" />
</mvc:View>
```

Thanks to the manifest dependency on `com.myorg.mylib`, UI5 loads the control from the
linked workspace package at runtime — no extra config needed beyond
`transpileDependencies` (section 2).

On the **TypeScript side**, the app can even import the generated event types of the
library control:

```ts
// packages/sample-app/webapp/controller/Main.controller.ts
import type { GreetingCard$PressEvent } from "com/myorg/mylib/GreetingCard";

public onGreetingPress(event: GreetingCard$PressEvent): void {
    const card = event.getSource();
    MessageToast.show(`Greeting card pressed by ${card.getName()}`);
}
```

Two `tsconfig.json` entries in the app make this work:

```jsonc
// packages/sample-app/tsconfig.json
{
  "compilerOptions": {
    "paths": {
      // resolve "com/myorg/mylib/*" imports into the workspace sibling
      "com/myorg/mylib/*": ["../sample-lib/src/com/myorg/mylib/*"]
    }
  },
  "include": [
    "./webapp/**/*",
    // pick up the library's generated control interfaces (*.gen.d.ts)
    // so their module augmentations ($GreetingCardSettings, typed
    // accessors, event types) are part of the app's program
    "../sample-lib/src/**/*.gen.d.ts"
  ]
}
```

> Note: the app's tsc is only used for typechecking (`--noEmit`), so no `rootDir`
> is set — that's what allows including files outside `webapp`.

The `*.gen.d.ts` files are auto-generated by `ui5-tooling-transpile`
(`generateTsInterfaces: true` in the library's `ui5.yaml`) and contain the typed
accessors (`getName()`, `firePress()`, …), the `$GreetingCardSettings` constructor
settings type and the `GreetingCard$PressEvent` event type.

---

## Scripts overview

| Command (from repo root)        | What it does                                                     |
| ------------------------------- | ---------------------------------------------------------------- |
| `pnpm install`                  | Install + link all workspace packages                            |
| `pnpm start`                    | Start app (:8080), lib (:8081), plugin (:8082), FLP (:8090)      |
| `pnpm -r run build`             | Build every package (`ui5 build`)                                |
| `pnpm -r run test`              | Run lint + tests in every package                                |
| `pnpm --filter com.myorg.myapp start` | Start a single package                                     |

## Gotchas & lessons learned

- **`transpileDependencies: true`** is required in the *consuming* app's transpile
  middleware when the linked dependency ships TypeScript sources — otherwise
  `library.js` 404s at runtime.
- **Unique ports per package** — `pnpm --parallel` starts everything at once; port
  collisions kill servers with `EADDRINUSE`.
- **`data-sap-ui-frame-options="allow"`** is needed in every app that is embedded
  cross-origin in the sandbox.
- **CORS middleware** is needed on any server whose resources are loaded directly by
  the launchpad origin (plugin components, reuse libs loaded via `url`, …).
- **Pin the CDN version** for the classic FLP sandbox (`1.120.x`), and always use the
  full patch version in CDN URLs.
- **pnpm build scripts**: dependency postinstall scripts (esbuild, drivers, …) must be
  allowed via `allowBuilds` in `pnpm-workspace.yaml`.
- **Library `*.gen.d.ts` files must be included via their _real_ path** in the app's
  `tsconfig.json` (`../sample-lib/src/**/*.gen.d.ts`) — TypeScript resolves the pnpm
  symlink, so include globs through `node_modules` never match the resolved files.

## License

Apache-2.0 (see individual packages).
