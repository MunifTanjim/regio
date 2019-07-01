import HeaderGrid from 'components/HeaderGrid'
import { get, groupBy, isNull, isNumber, map, mapValues, sum } from 'lodash-es'
import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { Grid, Header, Segment, Statistic } from 'semantic-ui-react'

const getAverage = marks => {
  return marks.length ? sum(marks) / marks.length : null
}

const nonNullToNumber = value => (isNull(value) ? value : Number(value))

function TeacherCourseMarksOverviewClassTests({
  TeacherId,
  TermId,
  CourseId,
  course,
  classTestMarks,
  title,
  HeaderRight
}) {
  const classTestMarkIds = useMemo(() => {
    const idPattern = RegExp(`^${TermId}_${CourseId}_`)
    return get(classTestMarks.items.groupedIdsByTeacher, TeacherId, []).filter(
      id => idPattern.test(id)
    )
  }, [TeacherId, TermId, CourseId, classTestMarks])

  const ctNumbers = useMemo(() => {
    const numbers = []
    if (course) {
      const maxNumber = Math.ceil(get(course, 'creditHr')) + 1
      for (let i = 0; i < maxNumber; i++) {
        numbers.push(String(i + 1))
      }
    }
    return numbers
  }, [course])

  const data = useMemo(() => {
    const data = {}

    const marksByNumber = mapValues(
      groupBy(
        classTestMarkIds.map(id => get(classTestMarks.items.byId, id)),
        'number'
      ),
      marks => map(marks, 'mark').map(nonNullToNumber)
    )

    data.marks = mapValues(marksByNumber, marks => marks.filter(isNumber))
    data.averageMarks = mapValues(data.marks, getAverage)
    data.taken = Object.values(
      mapValues(marksByNumber, marks => marks.some(isNumber))
    ).filter(Boolean).length

    return data
  }, [classTestMarkIds, classTestMarks])

  return (
    <Segment>
      <HeaderGrid Left={<Header>{title}</Header>} Right={HeaderRight} />

      <Grid columns={ctNumbers.length + 1} stackable textAlign="center">
        <Grid.Column>
          <Statistic size="tiny">
            <Statistic.Label>Tests Taken</Statistic.Label>
            <Statistic.Value>{data.taken}</Statistic.Value>
          </Statistic>
        </Grid.Column>
        {ctNumbers.map(number => {
          const avgMark = get(data.averageMarks, number, null)

          return (
            <Grid.Column key={`ct-avg-${number}`}>
              <Statistic size="tiny">
                <Statistic.Label>CT{number} Avg.</Statistic.Label>
                <Statistic.Value>
                  {isNull(avgMark) ? 'N/A' : avgMark.toFixed(2)}
                </Statistic.Value>
                {isNull(avgMark) ? (
                  '...'
                ) : (
                  <Statistic.Label>
                    {get(data.marks, number, []).length} Students
                  </Statistic.Label>
                )}
              </Statistic>
            </Grid.Column>
          )
        })}
      </Grid>
    </Segment>
  )
}

const mapStateToProps = ({ courses, marks }, { CourseId }) => ({
  classTestMarks: marks.classtest,
  course: get(courses.items.byId, CourseId)
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeacherCourseMarksOverviewClassTests)
