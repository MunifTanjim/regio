import { Button, FormField } from 'semantic-ui-react'

import React from 'react'

const FormButton = ({ ...props }) => (
  <FormField disabled={props.disabled}>
    <Button {...props} />
  </FormField>
)

export default FormButton
