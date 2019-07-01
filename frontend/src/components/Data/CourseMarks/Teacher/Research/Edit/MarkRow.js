import FormInput from 'components/Form/Input';
import React, { memo, useCallback } from 'react';
import { Button, Table } from 'semantic-ui-react';

function TeacherCourseMarksResearchEditMarkRow({
  TermId,
  CourseId,
  StudentId,
  initialValue,
  setFieldValue,
  maxMarks
}) {
  const handleReset = useCallback(() => {
    setFieldValue(StudentId, initialValue)
  }, [StudentId, initialValue, setFieldValue])

  return (
    <Table.Row>
      <Table.Cell>{StudentId}</Table.Cell>
      <Table.Cell collapsing textAlign="center">
        <FormInput
          type="number"
          min="0"
          max={maxMarks.viva}
          step="0.25"
          id={`${StudentId}.viva`}
          name={`${StudentId}.viva`}
          label={`marks for ${StudentId} viva`}
          hideLabel
        />
      </Table.Cell>
      <Table.Cell collapsing textAlign="center">
        <FormInput
          type="number"
          min="0"
          max={maxMarks.external}
          step="0.25"
          id={`${StudentId}.external`}
          name={`${StudentId}.external`}
          label={`marks for ${StudentId} external examiner`}
          hideLabel
        />
      </Table.Cell>
      <Table.Cell collapsing textAlign="center">
        <FormInput
          type="number"
          min="0"
          max={maxMarks.internal}
          step="0.25"
          id={`${StudentId}.internal`}
          name={`${StudentId}.internal`}
          label={`marks for ${StudentId} superviser`}
          hideLabel
        />
      </Table.Cell>
      <Table.Cell collapsing>
        <Button type="button" icon="undo" onClick={handleReset} />
      </Table.Cell>
    </Table.Row>
  )
}

export default memo(TeacherCourseMarksResearchEditMarkRow)
