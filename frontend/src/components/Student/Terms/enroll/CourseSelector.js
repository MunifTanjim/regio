import Select from 'components/Form/Select.js'
import { connect as connectFormik } from 'formik'
import {
  capitalize,
  difference,
  get,
  keyBy,
  map,
  mapValues,
  pick,
  zipObject
} from 'lodash-es'
import React, { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, FormGroup, Grid, Icon, Table } from 'semantic-ui-react'
import { getCourse } from 'store/actions/courses.js'
import { getTermCourses } from 'store/actions/terms.js'

const validTypes = ['regular', 'short', 'backlog']

const typeOptions = zipObject(validTypes, validTypes.map(capitalize))

function CourseSelector({
  courses: _courses,
  enrollments: _enrollments,
  termcourses,
  terms,
  getCourse,
  getTermCourses,
  arrayHelpers,
  formik: {
    isSubmitting,
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched
  }
}) {
  const TermId = useMemo(() => {
    const { SessionYearId, level, term } = get(values, 'Term', {})
    if (!(SessionYearId && level && term)) return null
    return get(terms.markedIds, `${SessionYearId}-${level}-${term}`)
  }, [terms.markedIds, values])

  useEffect(() => {
    if (TermId) getTermCourses(TermId)
  }, [TermId, getTermCourses])

  const enrollments = useMemo(() => {
    return map(
      get(_enrollments.items.groupedIds, [values.StudentId, TermId], []),
      id => get(_enrollments.items.byId, id, {})
    )
  }, [
    _enrollments.items.groupedIds,
    _enrollments.items.byId,
    values.StudentId,
    TermId
  ])

  const courseIds = useMemo(() => {
    return map(get(termcourses.items.groupedIdsByTerm, TermId, []), id =>
      get(termcourses.items.byId, [id, 'CourseId'])
    )
  }, [TermId, termcourses.items.byId, termcourses.items.groupedIdsByTerm])

  const enrolledCourses = useMemo(() => {
    return map(enrollments, enrollment =>
      pick(enrollment, ['CourseId', 'type'])
    )
  }, [enrollments])

  const courses = useMemo(() => {
    return zipObject(
      courseIds,
      courseIds.map(id => get(_courses.items.byId, id))
    )
  }, [courseIds, _courses.items.byId])

  const approvals = useMemo(() => {
    return mapValues(keyBy(enrollments, 'CourseId'), 'approved')
  }, [enrollments])

  useEffect(() => {
    if (enrolledCourses) {
      setFieldValue('courses', enrolledCourses, false)
      enrolledCourses.forEach(({ CourseId }) => {
        if (!courses[CourseId]) getCourse(CourseId)
      })
    }

    if (courseIds) {
      courseIds.forEach(id => {
        if (!courses[id]) getCourse(id)
      })
    }
  }, [TermId, courseIds, courses, enrolledCourses, getCourse, setFieldValue])

  const clearSelection = useCallback(() => {
    setFieldTouched('CourseId', false)
    setFieldValue('CourseId', '')
  }, [setFieldTouched, setFieldValue])

  const courseOptions = useMemo(() => {
    const ids = difference(
      courseIds,
      map(values.courses, 'CourseId').map(Number)
    )

    return ids.reduce((opts, id) => {
      opts[id] = `[${get(courses[id], 'code')}] ${get(
        courses[id],
        'title'
      )} (${get(courses[id], 'creditHr')})`
      return opts
    }, {})
  }, [courseIds, values.courses, courses])

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
            <Select
              id="type"
              name="type"
              label={`Type`}
              options={typeOptions}
              search
            />
          </FormGroup>
        </Grid.Column>
        <Grid.Column className="auto wide">
          <Button
            type="button"
            disabled={
              isSubmitting ||
              !!errors.CourseId ||
              !touched.CourseId ||
              !values.CourseId ||
              !values.type
            }
            onClick={() => {
              const { CourseId, type } = values
              if (CourseId && type) {
                arrayHelpers.push({ CourseId, type })
              }

              clearSelection()
            }}
            size="large"
            icon="add"
          />
        </Grid.Column>
      </Grid>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Code</Table.HeaderCell>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Credit</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Approved</Table.HeaderCell>
            <Table.HeaderCell collapsing />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {values.courses.map(({ CourseId: id, type }, index) => {
            const approved = get(approvals, id)
            return (
              <Table.Row key={index}>
                <Table.Cell>{get(courses[id], 'code')}</Table.Cell>
                <Table.Cell>{get(courses[id], 'title')}</Table.Cell>
                <Table.Cell>{get(courses[id], 'creditHr')}</Table.Cell>
                <Table.Cell>{get(typeOptions, type)}</Table.Cell>
                <Table.Cell>
                  <Icon name={approved ? 'check' : 'close'} />
                </Table.Cell>
                <Table.Cell collapsing>
                  {!approved && (
                    <Button
                      type="button"
                      icon="delete"
                      onClick={() => arrayHelpers.remove(index)}
                    />
                  )}
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </>
  )
}

const mapStateToProps = ({ courses, enrollments, terms, termcourses }) => {
  return {
    courses,
    enrollments,
    termcourses,
    terms
  }
}

const mapDispatchToProps = {
  getCourse,
  getTermCourses
}

const ConnectedCourseSelector = connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseSelector)

export default connectFormik(ConnectedCourseSelector)
