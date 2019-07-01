import FormInput from 'components/Form/Input'
import React, { memo, useCallback } from 'react'
import { Button, Table } from 'semantic-ui-react'
import AttendanceMarkField from './Form/AttendanceMarkField.js'

function TeacherCourseMarksSessionalEditMarkRow({
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
        <AttendanceMarkField
          max={maxMarks.attendance}
          id={`${StudentId}.attendance`}
          name={`${StudentId}.attendance`}
          label={`marks for ${StudentId} attendance`}
          TermId={TermId}
          CourseId={CourseId}
          StudentId={StudentId}
          setFieldValue={setFieldValue}
        />
      </Table.Cell>
      <Table.Cell collapsing textAlign="center">
        <FormInput
          type="number"
          min="0"
          max={maxMarks.performanceAndReports}
          step="0.25"
          id={`${StudentId}.performanceAndReports`}
          name={`${StudentId}.performanceAndReports`}
          label={`marks for ${StudentId} performance & reports`}
          hideLabel
        />
      </Table.Cell>
      <Table.Cell collapsing textAlign="center">
        <FormInput
          type="number"
          min="0"
          max={maxMarks.finalQuiz}
          step="0.25"
          id={`${StudentId}.finalQuiz`}
          name={`${StudentId}.finalQuiz`}
          label={`marks for ${StudentId} final quiz`}
          hideLabel
        />
      </Table.Cell>
      <Table.Cell collapsing textAlign="center">
        <FormInput
          type="number"
          min="0"
          max={maxMarks.finalViva}
          step="0.25"
          id={`${StudentId}.finalViva`}
          name={`${StudentId}.finalViva`}
          label={`marks for ${StudentId} final viva`}
          hideLabel
        />
      </Table.Cell>
      <Table.Cell collapsing>
        <Button type="button" icon="undo" onClick={handleReset} />
      </Table.Cell>
    </Table.Row>
  )
}

export default memo(TeacherCourseMarksSessionalEditMarkRow)
