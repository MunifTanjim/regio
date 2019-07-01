import React, { useMemo } from 'react'

import { ErrorMessage, Field, FieldArray } from 'formik'

import { Checkbox, FormField } from 'semantic-ui-react'

const formatOptions = options =>
  Object.entries(options).reduce((opts, [value, text]) => {
    opts.push({ text, value })
    return opts
  }, [])  

const FormCheckboxArray = ({ id, name, label, options, ...props }) => {
  const formattedOptions = useMemo(() => {
    return formatOptions(options)
  }, [options])

  return (
    <FormField>
      <label htmlFor={id}>{label}</label>
      <Field name={name}>
        {({ field: { value } }) => (
          <div id={id}>
            <FieldArray
              name={name}
              render={arrayHelpers =>
                formattedOptions.map(opt => (
                  <Checkbox
                    {...props}
                    key={opt.value}
                    value={opt.value}
                    label={opt.text}
                    checked={value.includes(opt.value)}
                    onChange={(_, data) => {
                      if (data.checked) arrayHelpers.push(data.value)
                      else arrayHelpers.remove(value.indexOf(data.value))
                    }}
                  />
                ))
              }
            />
          </div>
        )}
      </Field>
      <ErrorMessage name={name} component="p" className="red text" />
    </FormField>
  )
}

export default FormCheckboxArray
