import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Icon, Table } from 'semantic-ui-react'
import { getCourse } from 'store/actions/courses.js'

function StudentTermEnrollmentListItem({
  CourseId,
  course,
  approved,
  getCourse
}) {
  useEffect(() => {
    if (!course) getCourse(CourseId)
  }, [CourseId, course, getCourse])

  return (
    <Table.Row>
      <Table.Cell>{course && course.code}</Table.Cell>
      <Table.Cell>{course && course.title}</Table.Cell>
      <Table.Cell>{course && course.creditHr}</Table.Cell>

      <Table.Cell collapsing>
        <Icon name={approved ? 'check' : 'close'} />
      </Table.Cell>
    </Table.Row>
  )
}

const mapStateToProps = ({ courses }, { CourseId }) => ({
  course: courses.items.byId[CourseId]
})

const mapDispatchToProps = {
  getCourse
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentTermEnrollmentListItem)
