import { get } from 'lodash-es'
import React, { memo, useEffect } from 'react'
import { connect } from 'react-redux'
import { Header } from 'semantic-ui-react'
import { getCourse } from 'store/actions/courses.js'

function CourseHeader({ CourseId, course, getCourse, ...props }) {
  useEffect(() => {
    if (!course) getCourse(CourseId)
  }, [CourseId, course, getCourse])

  return (
    <Header {...props}>
      {get(course, 'title')}
      <Header.Subheader>{get(course, 'code')}</Header.Subheader>
    </Header>
  )
}

const mapStateToProps = ({ courses }, { CourseId }) => ({
  course: get(courses.items.byId, CourseId)
})

const mapDispatchToProps = {
  getCourse
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(CourseHeader))
