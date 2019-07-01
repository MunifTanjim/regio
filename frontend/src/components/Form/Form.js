import React from 'react'
import { connect } from 'formik'

import { Form } from 'semantic-ui-react'

const ConnectedForm = connect(
  ({ formik: { handleReset, handleSubmit }, ...props }) => (
    <Form onReset={handleReset} onSubmit={handleSubmit} {...props} />
  )
)

export default ConnectedForm
