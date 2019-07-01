import HeaderGrid from 'components/HeaderGrid'
import { get, isNull, isNumber } from 'lodash-es'
import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { Grid, Header, Segment, Statistic } from 'semantic-ui-react'

function StudentCourseMarksOverviewClassTests({
  StudentId,
  TermId,
  CourseId,
  course,
  classTestMarks,
  title
}) {
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
    const _data = { obtained: 0 }

    _data.marks = ctNumbers.reduce((marksByNumber, number) => {
      const mark = get(
        classTestMarks.items.byId,
        [`${TermId}_${CourseId}_${StudentId}_${number}`, 'mark'],
        null
      )
      marksByNumber[number] = isNull(mark) ? mark : Number(mark)
      return marksByNumber
    }, {})

    const sortedMarks = Object.values(_data.marks)
      .filter(isNumber)
      .sort()

    const countedClassTestsNumber = ctNumbers.length - 1

    for (let index = 0; index < countedClassTestsNumber; index++) {
      _data.obtained += sortedMarks[index] || 0
    }

    _data.total = countedClassTestsNumber * 20

    return _data
  }, [TermId, CourseId, StudentId, ctNumbers, classTestMarks])

  return (
    <Segment>
      <HeaderGrid Left={<Header>{title}</Header>} />

      <Grid columns={ctNumbers.length + 1} stackable textAlign="center">
        {ctNumbers
          .map(number => [number, get(data.marks, number)])
          .map(([number, mark]) => (
            <Grid.Column key={`ct-${number}`}>
              <Statistic size="small">
                <Statistic.Label>CT {number}</Statistic.Label>
                <Statistic.Value>
                  {isNull(mark) ? 'N/A' : `${mark}/20`}
                </Statistic.Value>
              </Statistic>
            </Grid.Column>
          ))}
        <Grid.Column>
          <Statistic size="small">
            <Statistic.Label>Total</Statistic.Label>
            <Statistic.Value>
              {data.obtained}/{data.total}
            </Statistic.Value>
          </Statistic>
        </Grid.Column>
      </Grid>
    </Segment>
  )
}

const mapStateToProps = ({ courses, marks }, { CourseId }) => ({
  course: get(courses.items.byId, CourseId),
  classTestMarks: marks.classtest
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentCourseMarksOverviewClassTests)
