import CourseHeader from 'components/Data/CourseHeader.js'
import TermHeader from 'components/Data/TermHeader.js'
import Form from 'components/Form/Form.js'
import HeaderGrid from 'components/HeaderGrid.js'
import { connect as connectFormik, Formik } from 'formik'
import {
  get,
  keyBy,
  mapValues,
  memoize,
  take,
  uniq,
  zipObject
} from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Grid,
  Header,
  Icon,
  Label,
  List,
  Message,
  Segment
} from 'semantic-ui-react'
import { getEnrollments, setEnrollmentSections } from 'store/actions/terms.js'
import * as Yup from 'yup'
import Permit from 'components/Permit'

const availableSectionNames = ['A', 'B', 'C']

const getNextSectionName = memoize(
  (name, sectionNames) => {
    const totalSections = sectionNames.length
    const nextIndex = sectionNames.indexOf(name) + 1
    return sectionNames[nextIndex % totalSections]
  },
  (name, sectionNames) => `${name}--${sectionNames.join('-')}`
)

const getPrevSectionName = memoize(
  (name, sectionNames) => {
    const totalSections = sectionNames.length
    const prevIndex = sectionNames.indexOf(name) - 1
    return sectionNames[prevIndex < 0 ? totalSections - 1 : prevIndex]
  },
  (name, sectionNames) => `${name}--${sectionNames.join('-')}`
)

function StudentIdItem({
  StudentId,
  sectionName,
  sectionNames,
  handleTransfer
}) {
  const prevName = useMemo(() => {
    return getPrevSectionName(sectionName, sectionNames)
  }, [sectionName, sectionNames])

  const nextName = useMemo(() => {
    return getNextSectionName(sectionName, sectionNames)
  }, [sectionName, sectionNames])

  const toPrev = useCallback(() => {
    if (sectionName === prevName) return
    handleTransfer(StudentId, sectionName, prevName)
  }, [handleTransfer, StudentId, sectionName, prevName])

  const toNext = useCallback(() => {
    if (sectionName === nextName) return
    handleTransfer(StudentId, sectionName, nextName)
  }, [handleTransfer, StudentId, sectionName, nextName])

  return (
    <List.Item>
      <Button type="button" basic size="mini" onClick={toPrev}>
        <Icon name="chevron left" /> {prevName}
      </Button>
      <Label basic>{StudentId}</Label>
      <Button type="button" basic size="mini" onClick={toNext}>
        {nextName} <Icon name="chevron right" />
      </Button>
    </List.Item>
  )
}

function _AssignSectionsForm({
  formik: { isSubmitting, isValid, status, values, setFieldValue },
  sectionNumber,
  setSectionNumber,
  sectionNames
}) {
  const handleTransfer = useCallback(
    (StudentId, fromName, toName) => {
      setFieldValue(
        fromName,
        get(values, fromName, []).filter(id => id !== StudentId)
      )
      setFieldValue(
        toName,
        get(values, toName, [])
          .concat(StudentId)
          .sort()
      )
    },
    [setFieldValue, values]
  )

  const decreaseSectionNumber = useCallback(() => {
    if (sectionNumber < 2) return

    const lastSectionName = availableSectionNames[sectionNumber - 1]
    const secondLastSectionName = availableSectionNames[sectionNumber - 2]

    if (values[lastSectionName].length) {
      setFieldValue(
        secondLastSectionName,
        get(values, secondLastSectionName, [])
          .concat(get(values, lastSectionName, []))
          .sort()
      )
      setFieldValue(lastSectionName, [])
    }

    setSectionNumber(n => n - 1)
  }, [sectionNumber, setFieldValue, setSectionNumber, values])

  return (
    <>
      <Segment>
        <HeaderGrid
          Left={
            <>
              <Button
                type="button"
                icon="minus"
                disabled={sectionNumber === 1}
                onClick={decreaseSectionNumber}
              />
              <Header style={{ display: 'inline', padding: '0 1em' }}>
                {sectionNumber} {sectionNumber > 1 ? 'Sections' : 'Section'}
              </Header>
              <Button
                type="button"
                icon="plus"
                disabled={sectionNumber === 3}
                onClick={() => setSectionNumber(n => n + 1)}
              />
            </>
          }
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
        <Message hidden={!status} color="yellow">
          {status}
        </Message>
      </Segment>

      <Grid columns={sectionNames.length}>
        {sectionNames.map(name => (
          <Grid.Column key={name}>
            <Segment textAlign="center">
              <Header>Section {name}</Header>
              <List>
                {get(values, name, []).map(StudentId => (
                  <StudentIdItem
                    key={StudentId}
                    StudentId={StudentId}
                    handleTransfer={handleTransfer}
                    sectionName={name}
                    sectionNames={sectionNames}
                  />
                ))}
              </List>
            </Segment>
          </Grid.Column>
        ))}
      </Grid>
    </>
  )
}

const AssignSectionsForm = connectFormik(_AssignSectionsForm)

function TermCourseAssignSections({
  TermId,
  CourseId,
  enrollments,
  getEnrollments,
  setEnrollmentSections
}) {
  useEffect(() => {
    getEnrollments(TermId, CourseId)
  }, [TermId, CourseId, getEnrollments])

  const [sectionNumber, setSectionNumber] = useState(1)

  const studentSections = useMemo(() => {
    const regex = RegExp(`^${TermId}_${CourseId}_`)
    return mapValues(
      keyBy(
        enrollments.items.allIds
          .filter(id => regex.test(id))
          .map(id => get(enrollments.items.byId, id)),
        'StudentId'
      ),
      'section'
    )
  }, [TermId, CourseId, enrollments])

  const initialSectionNames = useMemo(() => {
    const names = uniq(Object.values(studentSections)).filter(Boolean)
    return names.length ? names : null
  }, [studentSections])

  useEffect(() => {
    if (initialSectionNames) setSectionNumber(initialSectionNames.length)
  }, [initialSectionNames])

  const initialValues = useMemo(() => {
    const values = zipObject(
      availableSectionNames,
      availableSectionNames.map(() => [])
    )

    values.undefined = []

    Object.entries(studentSections).forEach(([StudentId, section]) => {
      values[String(section)].push(StudentId)
    })

    if (values.undefined.length) {
      const lastSectionName = availableSectionNames[sectionNumber - 1]
      values[lastSectionName].push(...values.undefined)
    }

    return values
  }, [studentSections, sectionNumber])

  const validationSchema = useMemo(() => {
    const schema = Yup.object(
      zipObject(
        availableSectionNames,
        availableSectionNames.map(() => Yup.array())
      )
    )
    return schema.shape({ undefined: Yup.array().max(0) })
  }, [])

  const sectionNames = useMemo(() => {
    return take(availableSectionNames, sectionNumber)
  }, [sectionNumber])

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
        isInitialValid={true}
        onSubmit={async (values, actions) => {
          actions.setStatus(null)

          try {
            await setEnrollmentSections(TermId, CourseId, values)
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
        }}
        onReset={(_, actions) => {
          actions.setValues(initialValues)
          setSectionNumber(initialSectionNames ? initialSectionNames.length : 1)
        }}
      >
        <Form>
          <AssignSectionsForm
            sectionNames={sectionNames}
            sectionNumber={sectionNumber}
            setSectionNumber={setSectionNumber}
          />
        </Form>
      </Formik>
    </Permit>
  )
}

const mapStateToProps = ({ enrollments }) => ({
  enrollments
})

const mapDispatchToProps = {
  getEnrollments,
  setEnrollmentSections
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TermCourseAssignSections)
