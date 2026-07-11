# ComponentLibrary

A React component library built with Vite, TypeScript, Tailwind CSS, and Storybook.

## Install

```bash
npm install @jhall72/component-library
```

Peer dependencies: `react >=18` and `react-dom >=18`.

## Usage

Import the component(s) you need and the stylesheet once at your app's entry point:

```tsx
import { Button } from "@jhall72/component-library";
import "@jhall72/component-library/styles.css";

export function App() {
  return (
    <Button variant="primary" size="md" onClick={() => alert("hi")}>
      Click me
    </Button>
  );
}
```

### Button

| Prop        | Type                                                  | Default     |
| ----------- | ----------------------------------------------------- | ----------- |
| `variant`   | `"primary" \| "secondary" \| "outline" \| "ghost"`    | `"primary"` |
| `size`      | `"sm" \| "md" \| "lg"`                                | `"md"`      |
| `fullWidth` | `boolean`                                             | `false`     |

All native `<button>` attributes are also supported.

## Development

```bash
npm install          # install dependencies
npm run storybook    # run Storybook at http://localhost:6006
npm run build        # build the library to dist/
npm run typecheck    # type-check with tsc
npm run lint         # lint with ESLint
```

### Adding a component

1. Create `src/components/<Name>/<Name>.tsx` and a barrel `index.ts`.
2. Add a `<Name>.stories.tsx` alongside it.
3. Re-export it from `src/index.ts`.

## Tech stack

- **Build:** Vite (library mode) → ESM + CJS + bundled `.d.ts`
- **Styling:** Tailwind CSS v4 (compiled to a single stylesheet; consumers don't need Tailwind)
- **Docs / dev:** Storybook with a11y and Vitest addons
- **Tooling:** TypeScript, ESLint

## Publishing

```bash
npm run build
npm publish   # publishConfig.access is set to "public"
```

## License

MIT
