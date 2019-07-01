import Form from 'components/Form/Form.js'
import Input from 'components/Form/Input.js'
import Select from 'components/Form/Select.js'
import { Formik } from 'formik'
import { zipObject } from 'lodash-es'
import React, { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, FormGroup, Message } from 'semantic-ui-react'
import { fetchAllBatchesPage } from 'store/actions/batches.js'
import api from 'utils/api.js'
import * as Yup from 'yup'

const callRegisterAPI = async data => {
  return api('/users/register', {
    method: 'POST',
    body: data
  })
}

const teacherRanks = {
  lecturer: `Lecturer`,
  'assistant-professor': `Assistant Professor`,
  'associate-professor': `Associate Professor`,
  professor: `Professor`
}

const teacherRankIds = Object.keys(teacherRanks)

const getValidationSchema = () =>
  Yup.object().shape({
    type: Yup.string()
      .oneOf(['student', 'teacher'])
      .required(`required`),
    BatchId: Yup.number().when('type', {
      is: 'student',
      then: Yup.number()
        .min(2012, 'batch starts from 2012')
        .required(`required`),
      otherwise: Yup.number().notRequired()
    }),
    rank: Yup.string().when('type', {
      is: 'teacher',
      then: Yup.string()
        .oneOf(teacherRankIds)
        .required(`required`),
      otherwise: Yup.string().notRequired()
    }),
    UserId: Yup.string().matches(/^[A-Z]{0,2}\d+$/, 'invalid format'),
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
  type: 'student',
  BatchId: '',
  rank: teacherRankIds[0],
  UserId: '',
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

function RegisterForm({ batches, fetchAllBatchesPage, handleSuccess }) {
  useEffect(() => {
    fetchAllBatchesPage()
  }, [fetchAllBatchesPage])

  const batchesOptions = useMemo(() => {
    return zipObject(batches, batches)
  }, [batches])

  const initialValues = useMemo(() => getInitialValues(), [])
  const validationSchema = useMemo(() => getValidationSchema(), [])
  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        const { data, error } = await callRegisterAPI(values)

        actions.setSubmitting(false)

        if (data) {
          handleSuccess(data)
        }

        if (error) {
          if (error.errors) {
            error.errors.forEach(({ param, message }) =>
              actions.setFieldError(param, message)
            )
          } else if (error.message) {
            actions.setStatus(error.message)
          } else {
            throw error
          }
        }
      } catch (err) {
        console.error(err)
      }
    },
    [handleSuccess]
  )

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, isValid, values, status }) => (
        <Form size="large">
          {status ? <Message color="yellow">{status}</Message> : null}

          <FormGroup widths="equal">
            <Select
              id="type"
              name="type"
              label={`Type`}
              options={{ student: `Student`, teacher: `Teacher` }}
            />
            {values.type === 'student' && (
              <Select
                id="BatchId"
                name="BatchId"
                label={`Batch`}
                options={batchesOptions}
              />
            )}
            {values.type === 'teacher' && (
              <Select
                id="rank"
                name="rank"
                label={`Academic Rank`}
                options={teacherRanks}
              />
            )}
          </FormGroup>

          <Input id="UserId" name="UserId" label={`ID`} icon="barcode" />

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

          <Input id="phone" name="phone" label={`Phone Number`} icon="phone" />

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

          <FormGroup style={{ paddingTop: '1em' }}>
            <Button type="reset">Cancel</Button>
            <Button
              positive
              type="submit"
              loading={isSubmitting}
              disabled={!isValid || isSubmitting}
            >
              Register
            </Button>
          </FormGroup>
        </Form>
      )}
    </Formik>
  )
}

const mapStateToProps = ({ batches }) => ({
  batches: batches.items.allIds
})

const mapDispatchToProps = {
  fetchAllBatchesPage
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterForm)
