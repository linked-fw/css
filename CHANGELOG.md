# @\_linked/css

## 0.3.1

### Patch Changes

- [#24](https://github.com/linked-fw/css/pull/24) [`db554c5`](https://github.com/linked-fw/css/commit/db554c59d3978126d1c98af18faf00154bf64a57) Thanks [@flyon](https://github.com/flyon)! - Declare `linkedPackage: true` in the manifest, so the package is discoverable by the Linked
  tooling that keys on that flag (`getLincdPackages`, and the dependency pass of the Vite
  `discoverWorkspaces`). No CSS, no export and no file list changes.

## 0.3.0

### Minor Changes

- [#11](https://github.com/linked-cm/css/pull/11) [`8147b14`](https://github.com/linked-cm/css/commit/8147b14c6a0dc95d6fc440036e451c22eb55ae97) Thanks [@flyon](https://github.com/flyon)! - Adds two token families the theme was missing, both because a consuming package had to
  invent them locally — which is the fragmentation `docs/styling-and-themes.md` warns against.

  **`--intent-{danger,success,warning,info}-{bg,bg-subtle,border,icon,text}`** — severity, for
  any component that needs it. This is the axis `--notification-*` cannot express: those
  tokens describe a container (padding, radius, shadow, one accent), not how serious the thing
  inside it is. Kept separate rather than folded in, because a form field showing a validation
  error is not a notification but it is `danger`. `-bg` is a solid tint; `-bg-subtle` is
  transparent so it composes over whatever is behind it; `-icon` is a step stronger than
  `-text` because an icon carries less area and needs more contrast to read at the same
  weight.

  **`--table-{header-bg,header-text,header-border,row-bg,row-bg-hover,row-border,cell-text,cell-text-primary}`**
  — the one composite component family the set was missing, alongside `--list-item-*`,
  `--modal-*`, `--navigation-*` and `--selector-*`. A list has no header row and no
  cell/row distinction, so a table cannot borrow `--list-item-*`. Two text tokens on purpose:
  `--table-cell-text` is the default cell weight and `--table-cell-text-primary` is the
  identifying column, which wants more contrast because it is what a reader scans down.

- [#12](https://github.com/linked-cm/css/pull/12) [`6b32141`](https://github.com/linked-cm/css/commit/6b321415fe65c9339bb3d4c1979ee30e0d157043) Thanks [@flyon](https://github.com/flyon)! - Add a named spacing scale: `--space-2xs` through `--space-3xl`.

  `--spacing()` is a compile-time function, so it needs the theme in scope. Any stylesheet
  compiled on its own — a CSS module inside a package, a consumer's own sheet — fails with
  "the --spacing theme variable was not found" and cannot use it at all. The workaround every
  such package reaches for is a private spacing scale, which is precisely the fragmentation
  `docs/styling-and-themes.md` warns against.

  Naming the steps resolves them once, at theme build time, so `var(--space-md)` works
  anywhere. The steps are the ones Create Now already uses, so this adopts a scale that is
  load-bearing rather than proposing a new one. The `-plus` half-steps are kept rather than
  rounded away: rounding them is what sends packages off to define their own scale.

### Patch Changes

- [#13](https://github.com/linked-cm/css/pull/13) [`f14c9e4`](https://github.com/linked-cm/css/commit/f14c9e4a39a4a155c15f4e6509de84b23ecc93d9) Thanks [@flyon](https://github.com/flyon)! - Stop naming a specific application in the theme.

  A framework package should not name one of its consumers — a reader of the token
  documentation has no way to know what that application is, and it implies the tokens exist
  to serve it rather than the other way round. The spacing-scale comment and one line of the
  styling guide are reworded to describe the tokens on their own terms.

## 0.2.0

### Minor Changes

- [#3](https://github.com/linked-cm/css/pull/3) [`798c306`](https://github.com/linked-cm/css/commit/798c30615ed99b20cfa7d6f75ecfff362cb668e0) Thanks [@github-actions](https://github.com/apps/github-actions)! - `@_linked/css` 0.2.0 — package ready for consumption by Linked apps.

  Breaking:

  - Drop `variables.css` (legacy reference-token file from pre-Tailwind-v4 era; never wired into the new theme system; zero consumers).

  Added:

  - `tailwindcss: "^4"` declared as `peerDependencies`. The package's `theme-defaults.css` and `utilities.css` use Tailwind v4 directives (`@theme`, `@source inline()`, `@utility`, `--spacing()`); the requirement is now explicit.
  - README documenting file structure, recommended import order, the two naming systems (state-first generic vs component-first specific), Tailwind v4 peer requirement, known gaps, and future ideas.
  - `docs/styling-and-themes.md` moved in from the (retiring) `lincd` package.
  - `preflight.css` moved in from `@_linked/cli`. Tailwind-derived preflight with `:not()` exclusions to preserve inline element styles (`<span>`, `<a>`, `<b>`, `<em>`, `<code>`, etc.). Apps that want LINCD-flavored CSS resets import this instead of the bundled Tailwind preflight; see README for the split-import pattern.

  Cleanup:

  - Fixed misleading comment in `utilities.css` (`mixins via @apply` → `Tailwind v4 @utility mixins`).

  Part of master plan Phase 0.2.

- [#4](https://github.com/linked-cm/css/pull/4) [`de38f84`](https://github.com/linked-cm/css/commit/de38f843400132f504b92bf59e13dd246868ec95) Thanks [@flyon](https://github.com/flyon)! - Default styling for `@_linked/react`'s built-in loader and error elements.

  **New: `loader.css`.** Default `.ld-loader` styling — small SVG ring with `stroke-dasharray` animation, `stroke: currentColor` so it inherits the parent text color. Includes an opt-in `.ld-loader--infinity` variant used by `LinkedInfinityLoader` (a branded loader exported from `@_linked/react`).

  **New: `error.css`.** Default `.ld-error` styling — small cross SVG using the new `--color-error` token.

  **New: `--color-error` token.** Single semantic variable for failure states, mapped to Tailwind red. Apps override in their own `@theme { ... }` block.

  **Auto-import.** Both `loader.css` and `error.css` are `@import`ed from `theme-defaults.css`, so any app already importing `@_linked/css/theme-defaults.css` picks them up without any extra setup. Apps override `.ld-loader` / `.ld-error` (size, color, animation) in their own theme.css to brand them.

  No breaking changes.

### Patch Changes

- [#3](https://github.com/linked-cm/css/pull/3) [`641b7c9`](https://github.com/linked-cm/css/commit/641b7c9a37656bfaf124234ba995842112131da2) Thanks [@github-actions](https://github.com/apps/github-actions)! - Remove `linkedPackage: true` — `@_linked/css` is a pure CSS asset package, not a JS module. The flag caused runtime consumers (like LincdServer's `getLincdPackages`) to attempt a dynamic `import()` of the package's main entry, which fails since there's no `index.js`.

## 0.1.1

### Patch Changes

- [`22e36e4`](https://github.com/linked-cm/css/commit/22e36e4a4e3ea05937284360e9b8e3af5ef8af94) - Initial release under the new publishing setup.
