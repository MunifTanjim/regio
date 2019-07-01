import Form from 'components/Form/Form.js'
import Input from 'components/Form/Input.js'
import Permit from 'components/Permit.js'
import { FieldArray, Formik } from 'formik'
import { last } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import { Button, Grid, Header, Message, Segment } from 'semantic-ui-react'
import { setEnrollments } from 'store/actions/students.js'
import * as Yup from 'yup'
import CourseSelector from './CourseSelector.js'
import TermSelector from './TermSelector.js'

const validLevels = ['1', '2', '3', '4']
const validTerms = ['1', '2']
const validTypes = ['regular', 'short', 'backlog']

const getValidationSchema = () => {
  return Yup.object().shape({
    StudentId: Yup.number()
      .min(1208000)
      .required(`required`),
    Term: Yup.object()
      .shape({
        SessionYearId: Yup.string()
          .matches(/^\d{4}-\d{4}$/)
          .test('is-valid-range', 'invalid range', sessionyear => {
            const [start, end] = sessionyear.split('-').map(Number)
            return end === start + 1
          })
          .required(`required`),
        level: Yup.string().oneOf(validLevels),
        term: Yup.string().oneOf(validTerms)
      })
      .required(`required`),
    courses: Yup.array()
      .of(
        Yup.object().shape({
          CourseId: Yup.number()
            .integer()
            .required(`required`),
          type: Yup.string()
            .oneOf(validTypes)
            .required(`required`)
        })
      )
      .required(`required`),
    CourseId: Yup.number().integer(),
    type: Yup.string().oneOf(validTypes)
  })
}

function Enroll({ StudentId, sessionyears, setEnrollments, navigate }) {
  return (
    <Permit sysadmin UserId={StudentId}>
      <Formik
        initialValues={{
          StudentId: StudentId,
          Term: {
            SessionYearId: last(sessionyears),
            level: validLevels[0],
            term: validTerms[0]
          },
          courses: [],
          CourseId: '',
          type: validTypes[0]
        }}
        enableReinitialize={true}
        validationSchema={getValidationSchema()}
        onSubmit={async (values, actions) => {
          const { StudentId, Term, courses } = values

          actions.setStatus(null)

          try {
            await setEnrollments(StudentId, { Term, courses })
            actions.setSubmitting(false)
            navigate('..')
          } catch (err) {
            actions.setSubmitting(false)

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
        }}
      >
        {({ isSubmitting, isValid, values, status }) => (
          <Form>
            <Segment>
              <Grid verticalAlign="middle">
                <Grid.Column className="grow wide">
                  <Header>Enroll</Header>
                </Grid.Column>
                <Grid.Column className="auto wide">
                  <Button type="reset">Reset</Button>
                  <Button
                    positive
                    type="submit"
                    loading={isSubmitting}
                    disabled={!isValid || isSubmitting}
                  >
                    Save
                  </Button>
                </Grid.Column>
              </Grid>
            </Segment>

            <Segment>
              {status ? <Message color="yellow">{status}</Message> : null}

              <Input
                id="StudentId"
                name="StudentId"
                label={`ID`}
                className="static"
                disabled
                static
              />

              <TermSelector />

              <FieldArray name="courses">
                {arrayHelpers => <CourseSelector arrayHelpers={arrayHelpers} />}
              </FieldArray>
            </Segment>
          </Form>
        )}
      </Formik>
    </Permit>
  )
}

const mapStateToProps = ({ sessionyears }) => {
  return {
    sessionyears: sessionyears.items.allIds
  }
}

const mapDispatchToProps = { setEnrollments }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Enroll)
