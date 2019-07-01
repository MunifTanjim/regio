import { Link } from '@reach/router'
import Form from 'components/Form/Form.js'
import Input from 'components/Form/Input.js'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit.js'
import { Formik } from 'formik'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Message, Segment } from 'semantic-ui-react'
import { updatePassword } from 'store/actions/currentUser.js'
import * as Yup from 'yup'

const getValidationSchema = () => {
  return Yup.object({
    currentPassword: Yup.string().required(`required`),
    password: Yup.string()
      .min(8, `must be at least 8 characters long`)
      .required(`required`),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref('password'), null], `recheck password`)
      .required(`required`)
  })
}

const initialValues = {
  currentPassword: '',
  password: '',
  passwordConfirmation: ''
}

function ChangePassword({ userId, updatePassword, navigate }) {
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await updatePassword(values)
        navigate('..')
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
    [navigate, updatePassword]
  )

  return (
    <Permit userId={userId}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid, status }) => (
          <Form>
            <Segment>
              <HeaderGrid
                Left={<Header>Change Password</Header>}
                Right={
                  <>
                    <Button as={Link} to={`..`}>
                      Go Back
                    </Button>
                    <Button type="reset">Reset</Button>
                    <Button
                      positive
                      type="submit"
                      loading={isSubmitting}
                      disabled={!isValid || isSubmitting}
                    >
                      Change
                    </Button>
                  </>
                }
              />
            </Segment>

            <Segment>
              <Message color="yellow" hidden={!status}>
                {status}
              </Message>

              <Input
                type="password"
                name="currentPassword"
                label={`Current Password`}
              />

              <Input type="password" name="password" label={`Password`} />

              <Input
                type="password"
                 name="passwordConfirmation"
                label={`Confirm Password`}
              />
            </Segment>
          </Form>
        )}
      </Formik>
    </Permit>
  )
}

const mapStateToProps = null

const mapDispatchToProps = {
  updatePassword
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangePassword)
