import React, { useMemo } from 'react'

import { Field, ErrorMessage } from 'formik'

import { FormField, Dropdown } from 'semantic-ui-react'

import formatDropdownOptions from 'utils/format-dropdown-options.js'

function FormSelect({ id, name, label, hideLabel = false, options, ...props }) {
  const formattedOptions = useMemo(() => {
    return formatDropdownOptions(options)
  }, [options])

  return (
    <FormField>
      <label htmlFor={id} className={hideLabel ? 'sr-only' : ''}>
        {label}
      </label>
      <Field name={name}>
        {({
          field: { name, value },
          form: { setFieldTouched, setFieldValue }
        }) => (
          <Dropdown
            {...props}
            selection
            id={id}
            name={name}
            value={value}
            options={formattedOptions}
            onBlur={() => setFieldTouched(name, true)}
            onChange={(_, { value }) => {
              setFieldTouched(name, true)
              setFieldValue(name, value)
            }}
          />
        )}
      </Field>
      <ErrorMessage name={name} component="p" className="red text" />
    </FormField>
  )
}

export default FormSelect
