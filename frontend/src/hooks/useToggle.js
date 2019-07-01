import { useState, useMemo } from 'react'

function useToggle(initalOpen = false) {
  const [open, setOpen] = useState(initalOpen)

  const handler = useMemo(
    () => ({
      open: () => setOpen(true),
      close: () => setOpen(true),
      toggle: () => setOpen(open => !open)
    }),
    []
  )

  return [open, handler]
}

export default useToggle
