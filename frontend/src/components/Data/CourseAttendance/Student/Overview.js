import HeaderGrid from 'components/HeaderGrid'
import { get } from 'lodash-es'
import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { Grid, Header, Segment, Statistic } from 'semantic-ui-react'
import { getAttendancesForStudent } from 'store/actions/students.js'

function StudentCourseAttendanceOverview({
  TermId,
  CourseId,
  StudentId,
  title,
  attendances
}) {
  const data = useMemo(() => {
    const data = {}

    const _attendances = get(attendances.forStudents, [
      StudentId,
      TermId,
      CourseId
    ])

    data.total = get(_attendances, 'allDates', []).length
    data.attended = get(_attendances, 'attendedDates', []).length
    data.percentage = Number(
      data.total === data.attended ? 100 : (data.attended / data.total) * 100
    ).toFixed(2)

    return data
  }, [TermId, CourseId, StudentId, attendances])

  return (
    <Segment>
      <HeaderGrid Left={<Header>{title}</Header>} />

      <Grid columns={3} verticalAlign="middle" stackable>
        <Grid.Row textAlign="center">
          <Grid.Column>
            <Statistic horizontal>
              <Statistic.Value>{data.total}</Statistic.Value>
              <Statistic.Label>Total Classes</Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column>
            <Statistic horizontal>
              <Statistic.Value>{data.attended}</Statistic.Value>
              <Statistic.Label>Attended Classes</Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column>
            <Statistic horizontal>
              <Statistic.Value>{data.percentage}</Statistic.Value>
              <Statistic.Label>% Percentage</Statistic.Label>
            </Statistic>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  )
}

const mapStateToProps = ({ attendances }) => ({
  attendances
})

const mapDispatchToProps = {
  getAttendancesForStudent
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentCourseAttendanceOverview)
