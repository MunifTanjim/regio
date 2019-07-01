import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Table } from 'semantic-ui-react'
import { getCourse } from 'store/actions/courses.js'

function TermCourseCells({ CourseId, course, getCourse }) {
  useEffect(() => {
    if (!course) getCourse(CourseId)
  }, [CourseId, course, getCourse])

  return (
    <>
      <Table.Cell>{get(course, 'code', '')}</Table.Cell>
      <Table.Cell>{get(course, 'title', '')}</Table.Cell>
      <Table.Cell>{get(course, 'creditHr', '')}</Table.Cell>
    </>
  )
}

const mapStateToProps = ({ courses, teachers }, { CourseId }) => ({
  course: courses.items.byId[CourseId]
})

const mapDispatchToProps = {
  getCourse
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TermCourseCells)
