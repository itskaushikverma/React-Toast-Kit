# React Toast Kit

Toast notifications for React. The package publishes the supplied toast implementation: a fixed top-right stack, slide-in and slide-out motion, and `normal`, `success`, and `error` styles.

The npm package name is `react-toast-kit`. That name is already registered on the public registry, so publishing this project needs a different name or a scope.

## Installation

```bash
npm install react-toast-kit
```

The package depends on `lucide-react`. React and React DOM are peer dependencies and must already be installed in the app:

```bash
npm install react react-dom
```

Supported ranges:

- `react` and `react-dom`: 18 or 19
- `lucide-react`: 1.x, installed with this package

## Setup

Wrap the tree that calls `useToast` with `ToastProvider`. The provider renders the toast stack itself.

```tsx
import { ToastProvider, useToast } from 'react-toast-kit';

function App() {
  return (
    <ToastProvider>
      <YourComponent />
    </ToastProvider>
  );
}
```

```tsx
import { useToast } from 'react-toast-kit';

function YourComponent() {
  const { toast, success, error, dismiss } = useToast();

  return (
    <>
      <button onClick={() => toast('Normal notification')}>Show toast</button>

      <button onClick={() => success('Operation successful')}>Success</button>

      <button onClick={() => error('Something went wrong')}>Error</button>
    </>
  );
}
```

`dismiss` takes the toast `id` from the `toasts` array. Calling it plays the exit animation and removes the toast after 500ms. Clicking a toast, or its × button, does the same thing.

## Tailwind CSS

Toast chrome, color, spacing, shadow, and motion are inline styles plus a `<style>` tag rendered by the container. Those do not need Tailwind.

The Lucide icons use these utility classes:

- `h-5 w-5 text-white` on the success icon
- `h-5 w-5 text-[#b91c1c]` on the error icon

Scan the published bundle so Tailwind generates them.

Tailwind CSS v4:

```css
@import 'tailwindcss';
@source '../node_modules/react-toast-kit/dist';
```

Tailwind CSS v3:

```js
// tailwind.config.js
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/react-toast-kit/dist/**/*.{js,cjs}',
  ],
};
```

The class names are complete string literals in the build, so a normal content scan is enough. No Tailwind theme changes or extra plugins are required.

## API

```ts
import { ToastProvider, useToast } from 'react-toast-kit';
```

`useToast()` returns:

| Member | Signature | Behavior |
| --- | --- | --- |
| `toast` | `(message: string, options?: { type?: 'normal' \| 'success' \| 'error'; duration?: number }) => void` | Adds a toast. Default type is `normal`. Default duration is `4000`. |
| `success` | `(message: string, duration?: number) => void` | Adds a success toast. Default duration is `4000`. |
| `error` | `(message: string, duration?: number) => void` | Adds an error toast. Default duration is `4000`. |
| `dismiss` | `(id: string) => void` | Starts the exit animation for that id. |
| `toasts` | `Toast[]` | The current stack, oldest first. |

```ts
type Toast = {
  id: string;
  message: string;
  type: 'normal' | 'success' | 'error';
  duration: number;
  createdAt: number;
  isExiting?: boolean;
};
```

`ToastProvider` accepts `children` and mounts the container after them.

A duration of `0` does not auto-dismiss. Any other positive duration starts the exit animation when it elapses. The exit animation is `0.5s`, and the toast is removed 500ms after exit starts.

### Appearance

The container is `position: fixed`, `z-index: 9999`, `top: 1rem`, `right: 1rem`, in a column with `gap: 0.5rem`.

| Type | Background | Text | Icon |
| --- | --- | --- | --- |
| `normal` | `#161a30` | `#ffffff` | none |
| `success` | `#388e3c` | `#ffffff` | `CircleCheckBig` |
| `error` | `#fee2e2` | `#b91c1c` | `OctagonAlert` |

Each toast slides in from the right (`slideIn`, `0.5s ease`) and slides out the same way (`slideOut`, `0.5s ease`).

## TypeScript

`dist/index.d.ts` is the type entry for both ESM and CommonJS. `Toast`, `ToastType`, `ToastOptions`, `ToastContextValue`, and `UseToastReturn` are exported.

```tsx
import { useToast, type Toast, type ToastOptions } from 'react-toast-kit';

const options: ToastOptions = { type: 'success', duration: 2500 };

function onClick() {
  const { toast, toasts } = useToast();
  toast('Saved', options);
  const current: Toast | undefined = toasts[0];
  return current;
}
```

## Compatibility

- React 18 and React 19
- Vite
- Next.js, including the App Router
- Client rendering and server rendering

The published ESM and CommonJS bundles start with `'use client'`, so a Next.js Server Component can import `ToastProvider` and use it as a client boundary:

```tsx
import { ToastProvider } from 'react-toast-kit';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
```

`requestAnimationFrame` runs from an effect, so it does not execute during `renderToString` or the server pass of a Next.js render. The first server HTML contains the empty container and the keyframe CSS. Toasts are created from client events.

`lucide-react` is externalized. React and React DOM are externalized and are not bundled into `dist`.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Local preview |
| `npm run build` | ESM, CommonJS, and `.d.ts` in `dist` |
| `npm test` | API, dismissal, duration, provider, and server-render tests |
| `npm run typecheck` | Typecheck the library source |
| `npm run verify` | Typecheck, test, build, then check exports, declarations, server render, and tarball contents |
| `npm run pack:check` | `npm pack --dry-run` |
| `npm run release` | `npm publish --access public` |

`prepublishOnly` runs `npm run verify`, so `npm publish` builds and tests before uploading.

## Verify locally with npm pack

From this repository:

```bash
npm run verify
npm pack
```

`npm pack` writes `react-toast-kit-1.0.0.tgz`. The tarball contains `package.json`, `README.md`, `LICENSE`, and `dist`. It does not contain `src` or `tests`.

In another project:

```bash
npm install /absolute/path/to/react-toast-kit-1.0.0.tgz
```

## Publish

```bash
npm login
npm whoami
npm publish --access public
```

`npm login` asks for your npm credentials. `npm whoami` should print the account that owns the package. `npm publish --access public` uploads the public package. The `prepublishOnly` script runs the verification suite first.

Install it somewhere else:

```bash
npm install react-toast-kit
```

## Pre-publishing checklist

- [ ] `npm whoami` is the account that should own the package
- [ ] `name` in `package.json` is the name you intend to publish
- [ ] `npm view <name>` reports a 404, or this release is an intentional version bump
- [ ] `version` is the version you intend to publish
- [ ] `react` and `react-dom` are peer dependencies, not dependencies
- [ ] `npm run verify` passes
- [ ] `npm pack --dry-run` lists `dist/index.js`, `dist/index.cjs`, `dist/index.d.ts`, `README.md`, and `LICENSE`
- [ ] The tarball does not contain `src` or tests
- [ ] A second project can install the tarball, wrap a tree in `ToastProvider`, and show all three toast types

## Troubleshooting

**`useToast must be used within a ToastProvider`**

The hook was called outside the provider. Wrap that part of the tree with `ToastProvider`, or move the hook into a child of the provider.

**Icons are missing their size or color**

The toast panel still uses its inline colors. The icon utilities were not generated. Add the `dist` path to your Tailwind content sources, as shown above, and restart the dev server.

**A toast never leaves**

`duration: 0` waits for a click or `dismiss(id)`. Any omitted duration uses `4000`.

**A toast disappears immediately in development**

React Strict Mode runs effects twice in development. The timer is cleared and started again. The toast still stays for the configured duration after the second run.

**Next.js reports that a hook ran in a Server Component**

Import the published package, not unpublished source files. The build entry is marked `'use client'`. If you transpile `src` yourself, keep that directive on the entry module.

**`ERESOLVE` while installing**

The app must use React 18 or 19. This package does not install its own React.
