import Form from 'components/Form/Form.js'
import Input from 'components/Form/Input.js'
import Select from 'components/Form/Select.js'
import { Formik } from 'formik'
import { zipObject } from 'lodash-es'
import React, { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, FormGroup, Message, Segment, Header } from 'semantic-ui-react'
import { createTeacher } from 'store/actions/teachers.js'
import * as Yup from 'yup'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { Link } from '@reach/router'

const teacherRanks = {
  lecturer: `Lecturer`,
  'assistant-professor': `Assistant Professor`,
  'associate-professor': `Associate Professor`,
  professor: `Professor`
}

const teacherRankIds = Object.keys(teacherRanks)

const getValidationSchema = () =>
  Yup.object().shape({
    rank: Yup.string()
      .oneOf(teacherRankIds)
      .required(`required`),
    UserId: Yup.string()
      .matches(/^T\d+$/, 'invalid format')
      .required(`required`),
    firstName: Yup.string().required(`required`),
    middleName: Yup.string(),
    lastName: Yup.string().required(`required`),
    dob: Yup.date().required(`required`),
    email: Yup.string()
      .email()
      .required(`required`),
    mobile: Yup.number().required(`required`),
    phone: Yup.number().notRequired(),
    password: Yup.string()
      .min(8, `must be at least 8 characters long`)
      .required(`required`),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref('password'), null], `recheck password`)
      .required(`required`)
  })

const getInitialValues = () => ({
  rank: teacherRankIds[0],
  UserId: 'T',
  firstName: '',
  middleName: '',
  lastName: '',
  dob: '',
  email: '',
  mobile: '',
  phone: '',
  password: '',
  passwordConfirmation: ''
})

function CreateTeacher({ createTeacher, navigate }) {
  const initialValues = useMemo(() => getInitialValues(), [])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await createTeacher(values)
        return navigate('..')
      } catch (err) {
        actions.setSubmitting(false)

        if (err) {
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
      }

      actions.setSubmitting(false)
    },
    [createTeacher, navigate]
  )

  return (
    <Permit sysadmin>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid, status }) => (
          <Form size="large">
            <Segment>
              <HeaderGrid
                Left={<Header>Create Teacher</Header>}
                Right={
                  <>
                    <Button as={Link} to={`..`}>
                      Go Back
                    </Button>
                    <Button type="reset">Cancel</Button>
                    <Button
                      positive
                      type="submit"
                      loading={isSubmitting}
                      disabled={!isValid || isSubmitting}
                    >
                      Create
                    </Button>
                  </>
                }
              />
            </Segment>

            <Segment>
              <Message color="yellow" hidden={!status}>
                {status}
              </Message>

              <FormGroup widths="equal">
                <Input id="UserId" name="UserId" label={`ID`} icon="barcode" />
                <Select
                  id="rank"
                  name="rank"
                  label={`Academic Rank`}
                  options={teacherRanks}
                />
              </FormGroup>

              <FormGroup widths="equal">
                <Input
                  id="firstName"
                  name="firstName"
                  label={`First Name`}
                  icon="user"
                />
                <Input
                  id="middleName"
                  name="middleName"
                  label={`Middle Name`}
                  icon="user"
                />
                <Input
                  id="lastName"
                  name="lastName"
                  label={`Last Name`}
                  icon="user"
                />
              </FormGroup>

              <Input
                id="dob"
                name="dob"
                type="date"
                label={`Date of Birth`}
                icon="calendar alternate"
                min="1900-01-01"
              />

              <Input
                id="email"
                name="email"
                type="email"
                label={`Email`}
                icon="envelope outline"
              />

              <Input
                id="mobile"
                name="mobile"
                label={`Mobile Number`}
                icon="mobile alternate"
              />

              <Input
                id="phone"
                name="phone"
                label={`Phone Number`}
                icon="phone"
              />

              <Input
                id="password"
                name="password"
                type="password"
                label={`Password`}
                icon="lock"
              />

              <Input
                id="passwordConfirmation"
                name="passwordConfirmation"
                type="password"
                label={`Confirm Password`}
                icon="lock"
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
  createTeacher
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateTeacher)
