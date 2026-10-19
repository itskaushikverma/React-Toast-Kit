# React Toast Kit

Toast notifications for React. Wrap the tree in `ToastProvider`, then call `useToast()` from any child.

## Install

```bash
npm install react-toast-kit-js
```

React 18 or 19 is required and is not bundled with this package.

## Usage

```jsx
import { ToastPosition, ToastProvider, useToast } from 'react-toast-kit-js'

function SaveButton() {
  const { success, toast } = useToast()

  return (
    <>
      <button onClick={() => success('Saved')}>Save</button>
      <button
        onClick={() =>
          toast('Saved', {
            duration: 3000,
            backgroundColor: '#4c1d95',
            textColor: '#f5f3ff',
            fontFamily: 'sans-serif',
            showCloseIcon: true,
            position: ToastPosition.BottomLeft,
          })
        }
      >
        Custom
      </button>
    </>
  )
}

export function App() {
  return (
    <ToastProvider position={ToastPosition.TopRight}>
      <SaveButton />
    </ToastProvider>
  )
}
```

Styles and animations are injected when a toast renders. There is no CSS file to import.

## API

`useToast()` must be called under `ToastProvider`.

| Method | Description |
| --- | --- |
| `toast(message, options?)` | Shows a toast and returns its id. |
| `success(message, durationOrOptions?)` | Success toast. A number sets the duration. An object uses the same options as `toast`. |
| `error(message, durationOrOptions?)` | Error toast. |
| `dismiss(id)` | Starts the exit animation for that toast. |
| `toasts` | The current toast list. |

`options` and `ToastProvider` props:

| Option | Description |
| --- | --- |
| `duration` | Milliseconds before the toast leaves. Defaults to `4000`. `0` keeps it until dismissed. |
| `icon` | A React node or icon component. `false` hides the icon. Success and error toasts have a default icon. |
| `textColor` | Text color. |
| `backgroundColor` | Background color. |
| `fontFamily` | Font. Defaults to `sans-serif`. |
| `showCloseIcon` | Shows the close button. Defaults to `true`. The close button always dismisses the toast. |
| `hideOnClick` | Clicking the toast body dismisses it. Defaults to `true`. |
| `position` | `ToastPosition.TopLeft`, `TopCenter`, `TopRight`, `BottomLeft`, or `BottomRight`. Defaults to top right. |

A toast slides in from the edge of its position.

## Develop

```bash
npm install
npm run dev
```

`npm run build` writes the publishable files to `dist/`. `npm publish` runs that build first.
