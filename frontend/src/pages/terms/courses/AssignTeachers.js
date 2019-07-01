import CourseHeader from 'components/Data/CourseHeader.js'
import TermHeader from 'components/Data/TermHeader.js'
import Form from 'components/Form/Form.js'
import HeaderGrid from 'components/HeaderGrid.js'
import { connect as connectFormik, Formik } from 'formik'
import { get, zipObject } from 'lodash-es'
import React, { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Dropdown,
  FormField,
  FormGroup,
  Header,
  Message,
  Segment
} from 'semantic-ui-react'
import { fetchAllTeachersPage } from 'store/actions/teachers.js'
import {
  getTermCourseTeachers,
  setTermCourseTeachers
} from 'store/actions/terms.js'
import getPersonName from 'utils/get-person-name'
import * as Yup from 'yup'
import Permit from 'components/Permit'

const availableSectionNames = ['A', 'B', 'C']

function SectionTeacherSelector({
  section,
  teachers,
  name,
  currentValue = [],
  setFieldValue
}) {
  const teacherOptions = useMemo(() => {
    return teachers.items.allIds.map(id => ({
      text: getPersonName(get(teachers.items.byId, [id, 'User', 'Person'])),
      value: id
    }))
  }, [teachers.items.allIds, teachers.items.byId])

  const onChange = useCallback(
    (_, { value }) => {
      setFieldValue(name, value)
    },
    [name, setFieldValue]
  )

  return (
    <FormField>
      <label>Section {section}</label>

      <Dropdown
        selection
        multiple
        search
        fluid
        options={teacherOptions}
        value={currentValue}
        onChange={onChange}
      />
    </FormField>
  )
}

function _AssignTeachersForm({
  formik: { isSubmitting, isValid, values, status, setFieldValue },
  teachers
}) {
  return (
    <Segment>
      <HeaderGrid
        Left={<Header>Assign Teachers</Header>}
        Right={
          <>
            <Button type="reset">Reset</Button>
            <Button
              positive
              type="submit"
              loading={isSubmitting}
              disabled={!isValid || isSubmitting}
            >
              Save
            </Button>
          </>
        }
      />

      <Message color="yellow" hidden={!status}>
        {status}
      </Message>

      <FormGroup grouped>
        {Object.keys(values.TeacherIdsBySection).map(section => (
          <SectionTeacherSelector
            key={section}
            section={section}
            teachers={teachers}
            name={`TeacherIdsBySection.${section}`}
            currentValue={get(values.TeacherIdsBySection, section)}
            setFieldValue={setFieldValue}
          />
        ))}
      </FormGroup>
    </Segment>
  )
}

const AssignTeachersForm = connectFormik(_AssignTeachersForm)

function TermCourseAssignTeachers({
  TermId,
  CourseId,
  teachers,
  fetchAllTeachersPage,
  termcourses,

  getTermCourseTeachers,
  setTermCourseTeachers
}) {
  useEffect(() => {
    fetchAllTeachersPage()
  }, [fetchAllTeachersPage])

  useEffect(() => {
    getTermCourseTeachers(TermId, { query: `filter=CourseId==${CourseId}` })
  }, [CourseId, TermId, getTermCourseTeachers])

  const initialValues = useMemo(() => {
    const values = {
      CourseId,
      TeacherIdsBySection: zipObject(
        availableSectionNames,
        availableSectionNames.map(() => [])
      )
    }

    const TeacherIdsBySection = get(
      termcourses.teacherIdsBySection,
      `${TermId}_${CourseId}`,
      {}
    )

    Object.entries(TeacherIdsBySection).forEach(([section, TeacherIds]) => {
      values.TeacherIdsBySection[section].push(...TeacherIds)
    })

    return values
  }, [CourseId, TermId, termcourses.teacherIdsBySection])

  const validationSchema = useMemo(() => {
    return Yup.object({
      TeacherIdsBySection: zipObject(
        availableSectionNames,
        availableSectionNames.map(() => Yup.array())
      )
    })
  }, [])

  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await setTermCourseTeachers(TermId, values)
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
    [TermId, setTermCourseTeachers]
  )

  return (
    <Permit sysadmin>
      <Segment>
        <HeaderGrid
          Left={<CourseHeader CourseId={CourseId} />}
          Right={<TermHeader TermId={TermId} />}
        />
      </Segment>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        <Form>
          <AssignTeachersForm teachers={teachers} />
        </Form>
      </Formik>
    </Permit>
  )
}

const mapStateToProps = ({ teachers, termcourses }) => ({
  teachers,
  termcourses
})

const mapDispatchToProps = {
  fetchAllTeachersPage,
  getTermCourseTeachers,
  setTermCourseTeachers
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TermCourseAssignTeachers)
