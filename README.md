# @_linked/css

CSS variables, utilities, and theme defaults for the [Linked](https://linked.cm) framework.

This is a **CSS-only asset package** — no JavaScript, no build step. It ships the design-token vocabulary and the Tailwind v4 theme primitives that all `@_linked/*` component packages and Linked-based apps consume.

---

## Files

| File | Purpose |
|---|---|
| [`preflight.css`](./preflight.css) | Tailwind-derived preflight with `:not()` exclusions to preserve inline element styles (`<span>`, `<a>`, `<b>`, `<em>`, `<code>`, etc.). Apps using `@_linked/css` typically import this *instead of* the bundled Tailwind preflight via the split-import pattern (see below). |
| [`package.css`](./package.css) | Tailwind v4 `@theme` registration of `--spacing: 0.25rem`. Import this from any module CSS file that uses Tailwind v4's `--spacing(N)` function. |
| [`theme-defaults.css`](./theme-defaults.css) | Component-first semantic tokens (`--card-bg`, `--popover-bg`, `--modal-shadow`, etc.) for ~15 Linked component groups + Tailwind `@theme static` palette + `@source inline()` safelists. Import this from your app theme. |
| [`utilities.css`](./utilities.css) | Tailwind v4 `@utility` mixins for layout primitives — `surface-base`, `card-base`, `modal-base`, `popover-base`, `section-base`, `element-base`. Import this from your app theme alongside `theme-defaults.css`. |
| [`docs/styling-and-themes.md`](./docs/styling-and-themes.md) | Long-form theming guide for app authors. |

---

## Recommended import order

In your app's main theme file (e.g. `src/css/theme.css`):

```css
/* 1. Tailwind v4 layers — split-import pattern to substitute the LINCD preflight */
@layer theme, base, components, utilities;
@import 'tailwindcss/theme.css' layer(theme);
@import '@_linked/css/preflight.css';            /* substitutes Tailwind's bundled preflight */
@import 'tailwindcss/utilities.css' layer(utilities);

/* 2. Tailwind config (provides Linked component content paths) */
@config "@_linked/cli/tailwind.config.js";

/* 3. @_linked/css theme defaults + utility mixins */
@import '@_linked/css/theme-defaults.css';
@import '@_linked/css/utilities.css';

/* 4. Your app-specific overrides — brand palette, page-level surface tokens, dark mode */
@theme static {
  --color-primary-500: #116d8d; /* example brand color */
  /* ... */
}

:root {
  --bg-page: var(--color-gray-50);
  --bg-card: var(--color-white);
  /* ... */
}
```

**Why the split-import?** The shorthand `@import 'tailwindcss';` brings in Tailwind's *bundled* preflight, which uses a bare `*, ::before, ::after` reset that wipes inline element styles (`<b>`, `<em>`, `<span>`, `<a>`, `<code>`, etc.). For app shells rendering rich content (chatbot messages, ontology descriptions, markdown-derived text), that reset is too aggressive. `@_linked/css/preflight.css` is the same Tailwind preflight minus the inline-element wipe, exposed via `:not()` exclusions on the universal selector. Importing the layers separately lets us substitute the LINCD-friendly preflight in.

In a Linked component package's module CSS (e.g. `Toggle.module.css`):

```css
@import './helpers/mixins.css';
@import '@_linked/css/package.css';

.Root {
  padding: var(--toggle-padding-y, --spacing(1)) var(--toggle-padding-x, --spacing(2));
  /* ... */
}
```

Component packages typically only need `package.css` because the consuming app provides the full theme. `package.css` is intentionally minimal so it doesn't inflate component bundles.

---

## Naming systems

`@_linked/css` uses **two intentional naming layers**, both Linked-style (neither is Tailwind-native):

### State-first / generic tokens

Examples: `--bg-card`, `--bg-modal`, `--bg-page`, `--spacing-card`, `--shadow-card`, `--radius-modal`.

These are page/app-surface tokens, used by `utilities.css`'s `@utility` mixins. They align with Tailwind utility class naming (`bg-*`, `shadow-*`, etc.). **Defined by the consuming app**, typically in the app's main theme file.

### Component-first / specific tokens

Examples: `--card-bg`, `--popover-bg`, `--modal-bg`, `--surface-bg`, `--button-primary-bg`, `--field-border`.

These are component primitives. Components reference state tokens for their defaults but expose component-specific tokens for fine-grained overrides. **Defined in `theme-defaults.css`**.

### Why both

Components fall through layers:

```css
.Toggle {
  background: var(--toggle-bg, var(--control-bg, var(--bg-active)));
  /*          └─ component-specific  └─ component-group  └─ state */
}
```

Apps can override at any layer. The state-first layer keeps Linked variable naming aligned with Tailwind's utility conventions; the component-first layer gives component authors precise control points.

### Semantic status family

Readiness and outcome UI share three framework statuses: `ready`, `attention`, and `blocked`. Each status provides a strong color plus `-soft`, `-text`, and `-border` variants:

```css
.statusCard {
  color: var(--status-attention-text);
  background: var(--status-attention-soft);
  border: 1px solid var(--status-attention-border);
}

.statusMark {
  background: var(--status-attention);
}
```

The defaults include light and `[data-theme='dark']` values. Apps may override the canonical tokens in their theme; package components should consume these names instead of defining local success/warning/danger palettes. These tokens describe whether something is ready, needs attention, or is blocked. Keep lifecycle labels such as draft or in progress in app-owned aliases when they do not carry one of those meanings.

### Known gap

`utilities.css`'s `@utility` mixins reference state-first tokens (`--bg-card`, `--bg-modal`, `--spacing-card`, etc.) that are **not** defined in `theme-defaults.css`. The consuming app must define them. Both CN's `src/scss/theme.css` and the `@_linked/cli` app template do this. If you import `utilities.css` without app-defined state tokens, the `@utility` mixins resolve to empty values silently. See follow-up ideation: [docs/ideas/014-promote-cn-css-tokens-to-linked-css.md](https://github.com/create-now/docs) (in the `create_now` workspace).

---

## Tailwind v4 peer dependency

This package declares `tailwindcss: "^4"` as a `peerDependency`. Linked apps are built around Tailwind v4 — `theme-defaults.css` uses `@theme`, `@theme static`, `@source inline(...)`, and `--spacing()`; `utilities.css` uses `@utility`. None of these directives work without Tailwind v4. Install Tailwind v4 in your app:

```bash
yarn add tailwindcss@^4 @tailwindcss/postcss@^4
```

(Linked-CLI-based apps already ship with Tailwind v4 transitively via `@_linked/cli`.)

---

## Future ideas

- **`--focus-*` / `--disabled-*` token namespace** — `@_linked/primitives` ships PostCSS mixins (`@define-mixin focus`, `@define-mixin disabled`) but no semantic tokens for these states beyond `--control-outline-*`. Adding `--focus-bg`, `--focus-ring-color`, `--disabled-opacity` etc. as a framework-default would let component authors share a consistent focus/disabled look without per-component re-declaration.
- **Dark mode framework defaults** — currently apps own `[data-theme='dark']` blocks for every token. Shipping a default dark palette in `theme-defaults.css` would reduce duplication; apps could override only brand-specific dark values. See ideation [013](https://github.com/create-now/docs) D11 (deferred).
- **Token catalogue / search UI** — interactive doc that lists every shipped token with live example. Could be auto-generated from `theme-defaults.css`.
- **Reconcile `--bg-*` (state-first) with `--*-bg` (component-first)** — long-term, document one as deprecated or unify the naming. Tracked in follow-up [014](https://github.com/create-now/docs).

---

## License

MIT.
