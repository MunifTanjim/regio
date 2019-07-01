import { useCallback, useState } from 'react'

function useModal(initalState = false) {
  const [open, setOpen] = useState(initalState)

  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])
  const handleToggle = useCallback(() => setOpen(open => !open), [])

  return [open, { handleOpen, handleClose, handleToggle }]
}

export default useModal
