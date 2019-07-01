import { useCallback, useState } from 'react'

function useQueryBox(setQueryObject) {
  const [active, setActive] = useState(false)

  const toggle = useCallback(() => {
    if (active) setQueryObject({})
    setActive(!active)
  }, [active, setQueryObject])

  return [active, toggle]
}

export default useQueryBox
