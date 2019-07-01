import HeaderGrid from 'components/HeaderGrid'
import { get, isNull, mapValues, pick, sum } from 'lodash-es'
import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { Grid, Header, Segment, Statistic } from 'semantic-ui-react'

const getAverage = marks => {
  return marks.length ? sum(marks) / marks.length : null
}

function TeacherCourseMarksOverviewSessional({
  TeacherId,
  TermId,
  CourseId,
  course,
  sessionalMarks,
  title,
  HeaderRight
}) {
  const sessionalMarkIds = useMemo(() => {
    const idPattern = RegExp(`^${TermId}_${CourseId}_`)
    return get(sessionalMarks.items.groupedIdsByTeacher, TeacherId, []).filter(
      id => idPattern.test(id)
    )
  }, [TeacherId, TermId, CourseId, sessionalMarks])

  const data = useMemo(() => {
    const data = {}

    const marks = sessionalMarkIds
      .map(id =>
        pick(get(sessionalMarks.items.byId, id), [
          'attendance',
          'performanceAndReports',
          'finalQuiz',
          'finalViva'
        ])
      )
      .filter(
        ({ finalQuiz, finalViva }) => !isNull(finalQuiz) || !isNull(finalViva)
      )
      .map(o => sum(Object.values(mapValues(o, Number))))

    if (marks.length) {
      data.isTaken = true
      data.taken = marks.length
      data.average = getAverage(marks)
    }

    return data
  }, [sessionalMarkIds, sessionalMarks])

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
  sessionalMarks: marks.sessional,
  course: get(courses.items.byId, CourseId)
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeacherCourseMarksOverviewSessional)
