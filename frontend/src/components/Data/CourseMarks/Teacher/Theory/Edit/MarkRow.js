import FormInput from 'components/Form/Input'
import React, { memo, useCallback } from 'react'
import { Button, Table } from 'semantic-ui-react'
import AttendanceMarkField from './Form/AttendanceMarkField'
import ClassTestsMarkField from './Form/ClassTestsMarkField'

function TeacherCourseMarksTheoryEditMarkRow({
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
        <ClassTestsMarkField
          max={maxMarks.classTests}
          id={`${StudentId}.classTests`}
          name={`${StudentId}.classTests`}
          label={`marks for ${StudentId} class tests`}
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
          max={maxMarks.finalExamSectionA}
          step="0.25"
          id={`${StudentId}.finalExamSectionA`}
          name={`${StudentId}.finalExamSectionA`}
          label={`marks for ${StudentId} final exam section A`}
          hideLabel
        />
      </Table.Cell>
      <Table.Cell collapsing textAlign="center">
        <FormInput
          type="number"
          min="0"
          max={maxMarks.finalExamSectionB}
          step="0.25"
          id={`${StudentId}.finalExamSectionB`}
          name={`${StudentId}.finalExamSectionB`}
          label={`marks for ${StudentId} final exam section B`}
          hideLabel
        />
      </Table.Cell>
      <Table.Cell collapsing>
        <Button type="button" icon="undo" onClick={handleReset} />
      </Table.Cell>
    </Table.Row>
  )
}

export default memo(TeacherCourseMarksTheoryEditMarkRow)
