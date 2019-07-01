import Form from 'components/Form/Form.js'
import Input from 'components/Form/Input.js'
import { Formik } from 'formik'
import React, { useCallback, useMemo } from 'react'
import { Button, Message, Segment } from 'semantic-ui-react'
import * as Yup from 'yup'

const getValidationSchema = () => {
  return Yup.object().shape({
    UserId: Yup.string().required(`required`),
    password: Yup.string().required(`required`)
  })
}

const getInitialValues = () => ({ UserId: '', password: '' })

function LogInForm({ logIn }) {
  const validationSchema = useMemo(() => getValidationSchema(), [])
  const initialValues = useMemo(() => getInitialValues(), [])
  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await logIn(values)
      } catch (err) {
        if (err.errors) {
          err.errors.forEach(({ param, message }) =>
            actions.setFieldError(param, message)
          )
        } else if (err.message) {
          actions.setStatus(err.message)
        } else {
          actions.setStatus(null)
          console.error(err)
        }
      }

      actions.setSubmitting(false)
    },
    [logIn]
  )

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, isValid, status }) => (
        <Form size="large">
          <Message color="yellow" hidden={!status}>
            {status}
          </Message>

          <Segment>
            <Input name="UserId" label={`User ID`} icon="user" />

            <Input
              name="password"
              type="password"
              label={`Password`}
              icon="lock"
            />

            <Button
              fluid
              positive
              size="large"
              type="submit"
              loading={isSubmitting}
              disabled={!isValid || isSubmitting}
            >
              Log In
            </Button>
          </Segment>
        </Form>
      )}
    </Formik>
  )
}

export default LogInForm
