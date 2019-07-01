import FormInput from 'components/Form/Input'
import React, { memo, useCallback } from 'react'
import { Button, Table } from 'semantic-ui-react'

function ClassTestMarkRow({ StudentId, value, setFieldValue }) {
  const handleReset = useCallback(() => {
    setFieldValue(StudentId, '')
  }, [StudentId, setFieldValue])

  if (Number.isNaN(Number(StudentId))) return null

  return (
    <Table.Row>
      <Table.Cell>{StudentId}</Table.Cell>
      <Table.Cell collapsing textAlign="center">
        <FormInput
          type="number"
          min="0"
          max="20"
          step="0.25"
          id={StudentId}
          name={StudentId}
          label={`marks for ${StudentId}`}
          hideLabel
        />
      </Table.Cell>
      <Table.Cell collapsing textAlign="center">
        20
      </Table.Cell>
      <Table.Cell collapsing>
        <Button
          type="button"
          icon="x"
          disabled={!value}
          onClick={handleReset}
        />
      </Table.Cell>
    </Table.Row>
  )
}

export default memo(ClassTestMarkRow)
