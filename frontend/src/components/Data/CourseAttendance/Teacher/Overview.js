import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid.js'
import Permit from 'components/Permit'
import { get, keyBy, keys } from 'lodash-es'
import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Grid, Header, Segment, Statistic } from 'semantic-ui-react'

function TeacherCourseAttendanceOverview({
  TeacherId,
  TermId,
  CourseId,
  attendances,
  title
}) {
  const attendancesByDate = useMemo(() => {
    const regex = RegExp(`^${TermId}_${CourseId}_`)

    return keyBy(
      attendances.items.allIds
        .filter(id => regex.test(id))
        .map(id => get(attendances.items.byId, id)),
      'date'
    )
  }, [TermId, CourseId, attendances])

  const data = useMemo(() => {
    const data = {}

    data.classTaken = keys(attendancesByDate).length

    const presences = Object.values(attendancesByDate).map(
      ({ StudentIds }) => StudentIds.length
    )

    data.minPresence = Math.min(...presences)
    data.maxPresence = Math.max(...presences)

    return data
  }, [attendancesByDate])

  return (
    <Segment>
      <HeaderGrid
        Left={<Header>{title}</Header>}
        Right={
          <>
            <Permit UserId={`T${TeacherId}`}>
              <Button color="grey" as={Link} to={`attendances/edit`}>
                Edit
              </Button>
            </Permit>
            <Button color="blue" as={Link} to={`attendances`}>
              View
            </Button>
            <Permit UserId={`T${TeacherId}`}>
              <Button color="green" as={Link} to={`attendances/take`}>
                Take for Today
              </Button>
            </Permit>
          </>
        }
      />

      <Grid columns={3} stackable textAlign="center">
        <Grid.Column>
          <Statistic size="tiny">
            <Statistic.Label>Class Taken</Statistic.Label>
            <Statistic.Value>{data.classTaken}</Statistic.Value>
          </Statistic>
        </Grid.Column>
        <Grid.Column>
          <Statistic size="tiny">
            <Statistic.Label>Minimum Presence</Statistic.Label>
            <Statistic.Value>
              {data.classTaken ? data.minPresence : 'N/A'}
            </Statistic.Value>
          </Statistic>
        </Grid.Column>
        <Grid.Column>
          <Statistic size="tiny">
            <Statistic.Label>Maximum Presence</Statistic.Label>
            <Statistic.Value>
              {data.classTaken ? data.maxPresence : 'N/A'}
            </Statistic.Value>
          </Statistic>
        </Grid.Column>
      </Grid>
    </Segment>
  )
}

const mapStateToProps = ({ attendances }) => ({
  attendances
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeacherCourseAttendanceOverview)
