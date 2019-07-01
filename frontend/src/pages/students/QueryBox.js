import React, { useEffect, useRef, useState } from 'react'
import { Button, Input } from 'semantic-ui-react'

function StudentListQueryBox({ active, setQueryObject }) {
  const [filterObject, setFilterObject] = useState('')

  const BatchRef = useRef()

  useEffect(() => {
    if (!active) {
      setQueryObject({})
      return
    }

    const filter = Object.keys(filterObject)
      .map(name => `${name}==${filterObject[name]}`)
      .join(',')

    if (filter) setQueryObject(o => ({ ...o, filter }))
  }, [active, filterObject, setQueryObject])

  return active ? (
    <>
      <Input
        label="Batch"
        type="text"
        ref={BatchRef}
        action={
          <Button
            type="button"
            icon="filter"
            onClick={() => {
              setFilterObject(o => ({
                ...o,
                BatchId: BatchRef.current.inputRef.current.value
              }))
            }}
          />
        }
      />
    </>
  ) : null
}

export default StudentListQueryBox
