# React → Vue conventions

The team learned these while converting the Team Store MVP workspace (about 22,500 lines of React) to Vue 3, checking every unit with DOM parity tests. Each one is a place where a direct translation changes the output. Follow them unless the target Vue project has already settled the question another way.

## Styles

- **Numeric style values.** React adds `px` to numeric inline-style values; Vue does not. Write every nonzero number as a string with its unit (`"12px"`). Write zero as `"0"`, not `"0px"`, because React renders zero without a unit. Unitless properties stay numbers: `fontWeight`, `opacity`, `zIndex`, `flex`, `lineHeight`, `order`.
- **Vendor-prefixed keys.** Use the literal `"-webkit-appearance"` key in `:style` objects. Vue drops the leading dash from camelCase `WebkitAppearance`; React keeps it.
- **`<style>` elements a component renders** (keyframes or overrides that exist while it is mounted) become `<component :is="'style'">` in the template, so the CSS exists only while the component is mounted, as in React. Don't move them into an SFC `<style>` block. Keep the CSS text in a data property and render it with `{{ css }}`: a template literal inside `{{ }}` breaks on the CSS's own `}}`.

## Props and events

- **Callback props stay props** (`onChange: Function`), called with the original signature (`onChange(value)`, `onClose()`). Don't turn them into emits; call sites then convert mechanically.
- **Setter props called with an updater function** (`setGroups(arr => …)`): the parent's setter accepts both forms: `(v) => (x = typeof v === "function" ? v(x) : v)`.
- **`{...rest}` and trailing style merges** → Vue attribute fallthrough on the root element.
- **`{...props}` spread onto a child component** → `v-bind="$props"`.
- **Declared but unused props stay declared.**
- **Bare boolean attributes** (`<Button danger>`) arrive as `""` unless the prop is declared `type: Boolean`. Declare it.
- **Props that hold React elements** (an `icon` prop holding JSX) → named slots. Components held in data render with `<component :is>`.
- **Refs passed as props** → a template ref in the parent, read with `$refs.x.$el`.

## Templates

- **Fragment roots** → multi-root templates. Never add a wrapper element; it changes layout.
- **Inline render helpers** (`renderRow(item)`, `panel(dense)`) → expand them in place at each call site, even when that duplicates template blocks.
- **Column definitions with render functions** (`render: (row) => <td/>`) → keep the columns as plain data with `h()` render functions and render them through a small functional component. Never store component instances or prebuilt vnodes in reactive data.
- **Browser globals** (`URL.createObjectURL`, custom `window` properties) aren't reachable from template expressions. Move those handlers into methods.
- **Multi-statement inline handlers** can't contain `//` comments or unescaped `"`. Move them into methods.
- **JSX text doesn't process `\uXXXX` escapes**; it renders the backslash sequence literally. Carry such text over verbatim.
- **Controlled `<select>`**: bind `:selected` on each `<option>` rather than `:value` on the `<select>`. React's server render puts `selected` on the option.

## Lifecycle and state

- **Effects with cleanup** → `watch` plus `beforeUnmount`, with identical timer and listener cleanup.
- **Effects without a dependency array** (they run after every render) → register in `mounted()` and `updated()`, clean up in `beforeUnmount()`.
- **State seeded by an effect after the first render** → seed it in `mounted()` plus a watch without `immediate: true`. `immediate: true` changes React's order (render first, then the effect).
- **`autoFocus`** → focus the element in `mounted()`.
- **`useId`** → a module-level counter (`prefix-N`).
- **Custom hooks** → composables.
- **Context providers** → `provide` / `inject`.
- **`Object.assign(window, {...})` globals shared between files** → ES module exports. Keep a `window` global only where code outside the converted files reads it.
