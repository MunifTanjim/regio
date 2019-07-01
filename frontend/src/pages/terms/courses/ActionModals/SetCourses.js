import Form from 'components/Form/Form.js'
import Input from 'components/Form/Input.js'
import Select from 'components/Form/Select.js'
import Permit from 'components/Permit.js'
import { connect as connectFormik, FieldArray, Formik, getIn } from 'formik'
import useModal from 'hooks/useModal.js'
import { get, pick } from 'lodash-es'
import React, { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  FormGroup,
  Grid,
  Header,
  Message,
  Modal,
  Table
} from 'semantic-ui-react'
import { fetchAllCoursesPage } from 'store/actions/courses.js'
import { setTermCourses } from 'store/actions/terms.js'
import * as Yup from 'yup'
import TermCourseCells from '../view/TermCourseCells.js'

function _TermCourses({
  name,
  courses,
  arrayHelpers,
  formik: {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    setFieldTouched,
    setFieldValue
  }
}) {
  const clearSelection = useCallback(() => {
    setFieldTouched('CourseId', false)
    setFieldValue('CourseId', '')
  }, [setFieldTouched, setFieldValue])

  const courseOptions = useMemo(() => {
    const selected = values[name].map(({ CourseId }) => String(CourseId))
    return Object.keys(courses)
      .filter(id => !selected.includes(id))
      .reduce((opts, id) => {
        opts[id] = `[${get(courses[id], 'code')}] ${get(
          courses[id],
          'title'
        )} (${get(courses[id], 'creditHr')})`
        return opts
      }, {})
  }, [courses, name, values])

  return (
    <>
      <Grid verticalAlign="middle">
        <Grid.Column className="grow wide">
          <FormGroup widths="equal">
            <Select
              id="CourseId"
              name="CourseId"
              label={`Course`}
              options={courseOptions}
              search
            />
          </FormGroup>
        </Grid.Column>
        <Grid.Column className="auto wide">
          <Button
            type="button"
            disabled={
              !isValid || isSubmitting || !touched.CourseId || !!errors.CourseId
            }
            onClick={() => {
              const { CourseId } = values
              if (CourseId) {
                arrayHelpers.push({ CourseId })
                clearSelection()
              }
            }}
            size="large"
            icon="add"
          />
        </Grid.Column>
      </Grid>

      <Table basic celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Code</Table.HeaderCell>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Credit Hour</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {getIn(values, name).map(({ CourseId }, index) => (
            <Table.Row key={index}>
              <TermCourseCells CourseId={CourseId} />
              <Table.Cell>
                <Button
                  type="button"
                  icon="delete"
                  onClick={() => arrayHelpers.remove(index)}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  )
}

const TermCourses = connectFormik(_TermCourses)

function SetCourses({
  TermId,
  term,
  termcourses,
  courses,
  setTermCourses,
  fetchAllCoursesPage
}) {
  useEffect(() => {
    fetchAllCoursesPage()
  }, [fetchAllCoursesPage])

  const [open, { handleOpen, handleClose }] = useModal(false)

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      startDate: Yup.date().required(`required`),
      endDate: Yup.date()
        .notRequired()
        .nullable(),
      CourseId: Yup.number().integer(),
      termcourses: Yup.array().of(
        Yup.object().shape({
          CourseId: Yup.number()
            .integer()
            .required(`required`)
        })
      )
    })
  }, [])

  const initialValues = useMemo(
    () => ({
      startDate: termcourses.length ? termcourses[0].startDate : '',
      endDate: termcourses.length ? termcourses[0].endDate || '' : '',
      CourseId: '',
      termcourses: termcourses.map(termcourse => pick(termcourse, ['CourseId']))
    }),
    [termcourses]
  )

  return (
    <Permit sysadmin>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={async ({ startDate, endDate, termcourses }, actions) => {
          actions.setStatus(null)

          try {
            await setTermCourses(TermId, {
              startDate,
              endDate: endDate || null,
              termcourses
            })

            actions.setSubmitting(false)

            handleClose()
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
        {({ isSubmitting, isValid, status }) => (
          <Modal
            trigger={<Button onClick={handleOpen}>Set</Button>}
            closeIcon
            open={open}
            onClose={handleClose}
            as={Form}
            size="large"
          >
            <Header>
              Set Courses for {get(term, 'level')}-{get(term, 'term')} (
              {get(term, 'SessionYearId')})
            </Header>

            <Modal.Content>
              {status ? <Message color="yellow">{status}</Message> : null}

              <FormGroup widths="equal">
                <Input
                  id="startDate"
                  name="startDate"
                  label={`Start Date`}
                  type="date"
                />

                <Input
                  id="endDate"
                  name="endDate"
                  label={`End Date`}
                  type="date"
                />
              </FormGroup>

              <FieldArray name="termcourses">
                {arrayHelpers => (
                  <TermCourses
                    name="termcourses"
                    courses={courses}
                    arrayHelpers={arrayHelpers}
                  />
                )}
              </FieldArray>
            </Modal.Content>
            <Modal.Actions>
              <Button type="reset">Reset</Button>
              <Button
                positive
                type="submit"
                loading={isSubmitting}
                disabled={!isValid || isSubmitting}
              >
                Save
              </Button>
            </Modal.Actions>
          </Modal>
        )}
      </Formik>
    </Permit>
  )
}

const mapStateToProps = ({ courses, terms, termcourses }, { TermId }) => ({
  term: get(terms.items.byId, TermId),
  termcourses: get(termcourses.items.groupedIdsByTerm, TermId, []).map(
    id => termcourses.items.byId[id]
  ),
  courses: courses.items.byId
})

const mapDispatchToProps = {
  setTermCourses,
  fetchAllCoursesPage
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SetCourses)
