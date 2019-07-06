import { useState, useMemo } from 'react'

function useToggle(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen)

  const handler = useMemo(
    () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
      toggle: () => setOpen(open => !open)
    }),
    []
  )

  return [open, handler]
}

export default useToggle
