import HeaderGrid from 'components/HeaderGrid'
import { get, isNull, mapValues, pick, sum } from 'lodash-es'
import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { Grid, Header, Segment, Statistic } from 'semantic-ui-react'

const getAverage = marks => {
  return marks.length ? sum(marks) / marks.length : null
}

function TeacherCourseMarksOverviewTheory({
  TeacherId,
  TermId,
  CourseId,
  course,
  theoryMarks,
  title,
  HeaderRight
}) {
  const theoryMarkIds = useMemo(() => {
    const idPattern = RegExp(`^${TermId}_${CourseId}_`)
    return get(theoryMarks.items.groupedIdsByTeacher, TeacherId, []).filter(
      id => idPattern.test(id)
    )
  }, [TeacherId, TermId, CourseId, theoryMarks])

  const data = useMemo(() => {
    const data = {}

    const marks = theoryMarkIds
      .map(id =>
        pick(get(theoryMarks.items.byId, id), [
          'attendance',
          'classTests',
          'finalExamSectionA',
          'finalExamSectionB'
        ])
      )
      .filter(
        ({ finalExamSectionA, finalExamSectionB }) =>
          !isNull(finalExamSectionA) || !isNull(finalExamSectionB)
      )
      .map(o => sum(Object.values(mapValues(o, Number))))

    if (marks.length) {
      data.isTaken = true
      data.taken = marks.length
      data.average = Number(getAverage(marks)).toFixed(2)
    }

    return data
  }, [theoryMarkIds, theoryMarks])

  return (
    <Segment>
      <HeaderGrid Left={<Header>{title}</Header>} Right={HeaderRight} />

      <Grid columns={2} stackable textAlign="center">
        <Grid.Column>
          <Statistic size="tiny">
            <Statistic.Label>Total Examinee</Statistic.Label>
            <Statistic.Value>
              {data.isTaken ? data.taken : 'N/A'}
            </Statistic.Value>
          </Statistic>
        </Grid.Column>
        <Grid.Column>
          <Statistic size="tiny">
            <Statistic.Label>Average Marks</Statistic.Label>
            <Statistic.Value>
              {data.isTaken ? data.average : 'N/A'}
            </Statistic.Value>
          </Statistic>
        </Grid.Column>
      </Grid>
    </Segment>
  )
}

const mapStateToProps = ({ courses, marks }, { CourseId }) => ({
  theoryMarks: marks.theory,
  course: get(courses.items.byId, CourseId)
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeacherCourseMarksOverviewTheory)
