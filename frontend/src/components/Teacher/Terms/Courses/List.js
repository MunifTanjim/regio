import Permit from 'components/Permit.js'
import { get, intersection } from 'lodash-es'
import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Grid, Header, Segment } from 'semantic-ui-react'
import { getCourse } from 'store/actions/courses.js'
import { getCoursesForTerm } from 'store/actions/teachers.js'
import { getTerm } from 'store/actions/terms.js'
import ListItem from './ListItem.js'

function TeacherTermCoursesList({
  linkToBase,
  TermId,
  term,
  getTerm,
  TeacherId,
  teachers,
  getCoursesForTerm
}) {
  useEffect(() => {
    if (!term) getTerm(TermId)
  }, [TermId, getTerm, term])

  useEffect(() => {
    getCoursesForTerm(TeacherId, TermId)
  }, [TeacherId, TermId, getCoursesForTerm])

  const courseIds = useMemo(() => {
    return intersection(
      get(teachers.items.coursesById, TeacherId),
      get(teachers.items.coursesByTerm, TermId)
    ).sort()
  }, [
    TeacherId,  
    TermId,
    teachers.items.coursesById,
    teachers.items.coursesByTerm
  ])

  return (
    <Permit sysadmin head UserId={`T${TeacherId}`}>
      <Segment>
        <Grid verticalAlign="middle" columns={2}>
          <Grid.Column className="grow wide">
            <Header>Courses</Header>
          </Grid.Column>
          <Grid.Column className="auto wide" />
        </Grid>

        {courseIds.map(id => (
          <ListItem
            key={id}
            linkToBase={linkToBase}
            TeacherId={TeacherId}
            TermId={TermId}
            CourseId={id}
          />
        ))}
      </Segment>
    </Permit>
  )
}

const mapStateToProps = ({ teachers, terms }, { TermId, TeacherId }) => {
  return {
    teachers,
    term: terms.items.byId[TermId]
  }
}

const mapDispatchToProps = {
  getCourse,
  getTerm,
  getCoursesForTerm
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeacherTermCoursesList)
