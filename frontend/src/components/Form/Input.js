import React from 'react'
import { Field, ErrorMessage } from 'formik'
import { FormField, Input } from 'semantic-ui-react'

const FormInput = ({
  id,
  name,
  type = 'text',
  label,
  hideLabel = false,
  placeholder,
  validate,
  icon,
  iconPosition = 'left',
  static: isStatic = false,
  ...props
}) => {
  id = id || name

  const iconProps = icon ? { icon, iconPosition } : {}

  return (
    <Field name={name} validate={validate}>
      {({ field, form }) => (
        <FormField
          disabled={props.disabled}
          error={Boolean(form.errors[name])}
          className={isStatic ? 'static' : ''}
        >
          <label htmlFor={id} className={hideLabel ? 'sr-only' : ''}>
            {label}
          </label>
          <Input
            {...field}
            id={id}
            type={type}
            placeholder={placeholder}
            {...iconProps}
            {...props}
          />
          <ErrorMessage name={name} component="p" className="red text" />
        </FormField>
      )}
    </Field>
  )
}

export default FormInput
