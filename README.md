# React Toast Kit

Toast notifications for React. Wrap the tree in `ToastProvider`, then call `useToast()` from any child.

## Install

```bash
npm install react-toast-kit-js
```

React 18 or 19 is required and is not bundled with this package.

## Usage

```jsx
import { ToastPosition, ToastProvider, useToast } from 'react-toast-kit-js';

function SaveButton() {
  const toast = useToast();

  return (
    <>
      <button onClick={() => toast.success('Saved')}>Save</button>
      <button
        onClick={() =>
          toast.normal('Saved', {
            duration: 3000,
            backgroundColor: '#0f766e',
            textColor: '#ecfdf5',
            showCloseIcon: true,
            showCopyButton: true,
            position: ToastPosition.BottomLeft,
          })
        }
      >
        Custom
      </button>
    </>
  );
}

export function App() {
  return (
    <ToastProvider position={ToastPosition.TopRight}>
      <SaveButton />
    </ToastProvider>
  );
}
```

Styles and animations are injected when a toast renders. There is no CSS file to import.

## API

`useToast()` must be called under `ToastProvider`.

| Method                                 | Description                               |
| -------------------------------------- | ----------------------------------------- |
| `normal(message, durationOrOptions?)`  | Normal toast. A number sets the duration. |
| `success(message, durationOrOptions?)` | Success toast.                            |
| `error(message, durationOrOptions?)`   | Error toast.                              |

`options` and `ToastProvider` props:

| Option            | Description                                                                                              |
| ----------------- | -------------------------------------------------------------------------------------------------------- |
| `duration`        | Milliseconds before the toast leaves. Defaults to `4000`. `0` keeps it until closed.                     |
| `icon`            | A React node or icon component. `false` hides the icon. Success and error toasts have a default icon.    |
| `textColor`       | Text color.                                                                                              |
| `backgroundColor` | Background color.                                                                                        |
| `fontFamily`      | Font. Defaults to `sans-serif`.                                                                          |
| `showCloseIcon`   | Shows the close button. Defaults to `true`.                                                              |
| `showCopyButton`  | Shows the copy button. Defaults to `false`.                                                              |
| `hideOnClick`     | Clicking the toast body dismisses it. Defaults to `false`.                                               |
| `position`        | `ToastPosition.TopLeft`, `TopCenter`, `TopRight`, `BottomLeft`, or `BottomRight`. Defaults to top right. |

## Develop

```bash
npm install
npm run dev
```

One Vite config covers both targets:

- `npm run build` → npm package in `dist/` (`npm publish` runs this)
- `npm run build:demo` → Vercel site in `dist-demo/` (used by `vercel.json`)

<!-- AUTHOR:START -->

## 👤 Author

<div align="center">
  <img src="https://github.com/itskaushikverma.png" alt="Developer" width="100" height="100" style="border-radius:50%; width:100px; height:100px; object-fit:cover; display:block;"/>

  <h3>Kaushik Verma</h3>

  <p>
    <a href="mailto:kaushikverma321@gmail.com"><img src="https://img.shields.io/badge/Email-kaushikverma321@gmail.com-EA4335?style=flat-square&logo=gmail" alt="Email" /></a>
    <a href="https://www.kaushikverma.com"><img src="https://img.shields.io/badge/Website-https://www.kaushikverma.com-000000?style=flat-square&logo=vercel" alt="Portfolio" /></a>
    <a href="https://github.com/itskaushikverma"><img src="https://img.shields.io/badge/GitHub-itskaushikverma-181717?style=flat-square&logo=github" alt="GitHub" /></a>
    <a href="https://www.linkedin.com/in/itskaushikverma"><img src="https://img.shields.io/badge/LinkedIn-https://www.linkedin.com/in/itskaushikverma-0077B5?style=flat-square&logo=linkedin" alt="LinkedIn" /></a>
    <a href="https://x.com/SilentK68296830"><img src="https://img.shields.io/badge/Twitter-https://x.com/SilentK68296830-1DA1F2?style=flat-square&logo=twitter" alt="Twitter" /></a>
  </p>

  <p>Open to product feedback, collaboration, and thoughtful conversation.</p>
</div>

<div align="center">
  <p>If you found this project helpful, please consider giving it a ⭐️</p>
  <a href="https://github.com/itskaushikverma/React-Toast-Kit"><img src="https://img.shields.io/github/stars/itskaushikverma/React-Toast-Kit?style=social" alt="GitHub stars" /></a>
</div>
<!-- AUTHOR:END -->
