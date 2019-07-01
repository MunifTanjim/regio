import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import { get, keyBy, map, mapValues } from 'lodash-es'
import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Grid, Header, Label, Segment } from 'semantic-ui-react'
import { getCourse } from 'store/actions/courses.js'
import { getEnrollments } from 'store/actions/students.js'

function _ListItem({ CourseId, course, type, getCourse, linkToBase }) {
  useEffect(() => {
    if (!course) getCourse(CourseId)
  }, [CourseId, course, getCourse])

  return (
    <Segment>
      <HeaderGrid
        Left={
          <Header>
            {get(course, 'title', '')}
            <Header.Subheader>
              <Label attached="top right">
                {get(course, 'type', '').toUpperCase()} [{type}]
              </Label>

              {get(course, 'code', '')}
            </Header.Subheader>
          </Header>
        }
        Right={
          <Button as={Link} to={`${linkToBase}${CourseId}`}>
            Open
          </Button>
        }
      />
    </Segment>
  )
}

const _mapStateToProps = ({ courses }, { CourseId }) => ({
  course: get(courses.items.byId, CourseId)
})

const _mapDispatchToProps = {
  getCourse
}

const ListItem = connect(
  _mapStateToProps,
  _mapDispatchToProps
)(_ListItem)

function StudentTermCoursesList({
  linkToBase,
  StudentId,
  TermId,
  enrollments,
  getEnrollments
}) {
  useEffect(() => {
    getEnrollments(StudentId, { query: `filter=TermId==${TermId}` })
  }, [StudentId, TermId, getEnrollments])

  const enrollmentIds = useMemo(() => {
    return get(enrollments.items.groupedIds, [StudentId, TermId], []).sort()
  }, [StudentId, TermId, enrollments.items.groupedIds])

  const CourseIds = useMemo(() => {
    return map(enrollmentIds, id =>
      get(enrollments.items.byId, [id, 'CourseId'])
    )
  }, [enrollmentIds, enrollments.items.byId])

  const typeByCourseId = useMemo(() => {
    return mapValues(
      keyBy(
        map(enrollmentIds, id => get(enrollments.items.byId, id)),
        'CourseId'
      ),
      'type'
    )
  }, [enrollmentIds, enrollments.items.byId])

  return (
    <Segment>
      <HeaderGrid
        Left={
          <Grid.Column className="grow wide">
            <Header>Courses</Header>
          </Grid.Column>
        }
      />

      {CourseIds.map(id => (
        <ListItem
          key={id}
          CourseId={id}
          type={typeByCourseId[id]}
          linkToBase={linkToBase}
        />
      ))}
    </Segment>
  )
}

const mapStateToProps = ({ enrollments }) => ({
  enrollments
})

const mapDispatchToProps = {
  getEnrollments
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentTermCoursesList)
