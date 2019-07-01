import { ErrorMessage, FastField, getIn } from 'formik'
import React, { useCallback } from 'react'
import { Button, FormField, Input } from 'semantic-ui-react'
import api from 'utils/api'

function ClassTestsMarkField({
  id,
  name,
  label,
  static: isStatic = false,
  TermId,
  CourseId,
  StudentId,
  setFieldValue,
  ...props
}) {
  const calculateClassTestsMark = useCallback(async () => {
    const { data, error } = await api(
      `/students/${StudentId}/terms/${TermId}/courses/${CourseId}/marks/action/calculate-classtests-mark`
    )

    if (error) {
      console.error(error)
      return
    }

    setFieldValue(name, data.mark)
  }, [StudentId, TermId, CourseId, setFieldValue, name])

  id = id || name

  return (
    <FastField name={name}>
      {({ field, form }) => (
        <FormField
          disabled={props.disabled}
          error={Boolean(getIn(form.errors, name))}
          className={isStatic ? 'static' : ''}
        >
          <label htmlFor={id} className="sr-only">
            {label}
          </label>
          <Input
            {...field}
            id={id}
            type="number"
            min="0"
            step="0.25"
            {...props}
            action
          >
            <input />
            <Button
              type="button"
              icon="refresh"
              onClick={calculateClassTestsMark}
            />
          </Input>
          <ErrorMessage name={name} component="p" className="red text" />
        </FormField>
      )}
    </FastField>
  )
}

export default ClassTestsMarkField
