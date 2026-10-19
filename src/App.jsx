import { useState } from 'react'
import { Info } from 'lucide-react'
import { ToastPosition, ToastProvider, useToast } from './index.js'

const POSITIONS = [
  [ToastPosition.TopLeft, 'Top left'],
  [ToastPosition.TopCenter, 'Top center'],
  [ToastPosition.TopRight, 'Top right'],
  [ToastPosition.BottomLeft, 'Bottom left'],
  [ToastPosition.BottomRight, 'Bottom right'],
]

function Controls({ position, onPositionChange }) {
  const { toast, success, error } = useToast()

  return (
    <main
      style={{
        minHeight: '100vh',
        margin: 0,
        boxSizing: 'border-box',
        background: '#f3f4f6',
        color: '#111827',
        fontFamily: 'sans-serif',
        padding: '2rem',
      }}
    >
      <h1>React Toast Kit</h1>
      <label style={{ display: 'block', marginBottom: '1rem' }}>
        Position{' '}
        <select value={position} onChange={(event) => onPositionChange(event.target.value)}>
          {POSITIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button type="button" onClick={() => toast('Normal notification')}>
          Normal
        </button>
        <button type="button" onClick={() => success('Operation successful', 4000)}>
          Success
        </button>
        <button type="button" onClick={() => error('Something went wrong')}>
          Error
        </button>
        <button
          type="button"
          onClick={() =>
            toast('Custom toast', {
              duration: 5000,
              icon: Info,
              backgroundColor: '#4c1d95',
              textColor: '#f5f3ff',
              fontFamily: 'sans-serif',
              showCloseIcon: true,
            })
          }
        >
          Custom
        </button>
        <button type="button" onClick={() => toast('No close icon', { showCloseIcon: false, hideOnClick: false })}>
          No close icon
        </button>
        <button
          type="button"
          onClick={() => toast('Click the toast to hide', { duration: 0, showCloseIcon: false, hideOnClick: true })}
        >
          Hide on click
        </button>
      </div>
    </main>
  )
}

export default function App() {
  const [position, setPosition] = useState(ToastPosition.TopRight)

  return (
    <ToastProvider position={position}>
      <Controls position={position} onPositionChange={setPosition} />
    </ToastProvider>
  )
}
