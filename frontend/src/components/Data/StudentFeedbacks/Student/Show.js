import HeaderGrid from 'components/HeaderGrid.js'
import { sum, get, groupBy, intersection, mapValues } from 'lodash-es'
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Header, List, Segment } from 'semantic-ui-react'
import { fetchAllTeachersPage } from 'store/actions/teachers.js'
import {
  getAllFeedbackStatements,
  getStudentFeedbacks,
  getTermCourseTeachers
} from 'store/actions/terms.js'
import getPersonName from 'utils/get-person-name'

const rateString = {
  '-2': 'Strongly Disagree',
  '-1': 'Disagree',
  '0': 'Neutral',
  '1': 'Agree',
  '2': 'Strongly Agree'
}

function StudentFeedbacksShow({
  TermId,
  CourseId,
  teachers,
  getStudentFeedbacks,
  termcourses,
  studentfeedbacks,
  getAllFeedbackStatements,
  getTermCourseTeachers,
  fetchAllTeachersPage
}) {
  useEffect(() => {
    fetchAllTeachersPage()
  }, [fetchAllTeachersPage])

  useEffect(() => {
    getStudentFeedbacks(TermId, CourseId)
  }, [CourseId, TermId, getStudentFeedbacks])

  useEffect(() => {
    getStudentFeedbacks(TermId, CourseId)
    getAllFeedbackStatements(TermId, CourseId)
    getTermCourseTeachers(TermId, { query: `filter=CourseId==${CourseId}` })
  }, [
    CourseId,
    TermId,
    getAllFeedbackStatements,
    getStudentFeedbacks,
    getTermCourseTeachers
  ])

  const teacherIds = useMemo(() => {
    return Object.keys(
      get(termcourses.sectionsByTeacherId, `${TermId}_${CourseId}`, {})
    )
  }, [CourseId, TermId, termcourses.sectionsByTeacherId])

  const [studentCount, setStudentCount] = useState(0)

  const data = useMemo(() => {
    const feedbackIds = intersection(
      get(studentfeedbacks.items.groupedIdsByTerm, TermId),
      get(studentfeedbacks.items.groupedIdsByCourse, CourseId)
    )

    const statementIdsToRate = studentfeedbacks.statementItems.allIds.filter(
      id => get(studentfeedbacks.statementItems.byId, [id, 'toRate']) === true
    )

    let studentCount = 0

    const data = teacherIds.map(Number).reduce((byTeacherId, TeacherId) => {
      const feedbacks = feedbackIds
        .filter(
          id =>
            get(studentfeedbacks.items.byId, [id, 'TeacherId']) === TeacherId
        )
        .map(id => get(studentfeedbacks.items.byId, id))

      byTeacherId[TeacherId] = mapValues(
        groupBy(feedbacks, 'FeedbackStatementId'),
        (items, statementId) =>
          mapValues(
            groupBy(
              items,
              statementIdsToRate.includes(+statementId) ? 'rate' : 'comment'
            ),
            groupedItems => {
              if (groupedItems.length > studentCount) {
                studentCount = groupedItems.length
              }

              return {
                count: groupedItems.length,
                percentage: Number(
                  (groupedItems.length / items.length) * 100
                ).toFixed(2)
              }
            }
          )
      )

      return byTeacherId
    }, {})

    setStudentCount(studentCount)

    return data
  }, [CourseId, TermId, studentfeedbacks, teacherIds])

  const scoreByTeacherId = useMemo(() => {
    const feedbackIds = intersection(
      get(studentfeedbacks.items.groupedIdsByTerm, TermId),
      get(studentfeedbacks.items.groupedIdsByCourse, CourseId)
    )

    const statementIdsToRate = studentfeedbacks.statementItems.allIds.filter(
      id => get(studentfeedbacks.statementItems.byId, [id, 'toRate']) === true
    )

    const totalScore = statementIdsToRate.length * 5

    return teacherIds.map(Number).reduce((byTeacherId, TeacherId) => {
      const scores = feedbackIds
        .filter(
          id =>
            get(studentfeedbacks.items.byId, [id, 'TeacherId']) === TeacherId &&
            statementIdsToRate.includes(
              +get(studentfeedbacks.items.byId, [id, 'FeedbackStatementId'])
            ) &&
            get(studentfeedbacks.items.byId, [id, 'rate'])
        )
        .map(id => Number(get(studentfeedbacks.items.byId, [id, 'rate'])) + 3)

      const obtainedScore = sum(scores)

      byTeacherId[TeacherId] = Number(
        ((obtainedScore / totalScore) * 100) / studentCount
      ).toFixed(2)

      return byTeacherId
    }, {})
  }, [
    CourseId,
    TermId,
    studentCount,
    studentfeedbacks.items.byId,
    studentfeedbacks.items.groupedIdsByCourse,
    studentfeedbacks.items.groupedIdsByTerm,
    studentfeedbacks.statementItems.allIds,
    studentfeedbacks.statementItems.byId,
    teacherIds
  ])

  return (
    <>
      <Segment>
        <HeaderGrid Left={<Header>Student Feedbacks</Header>} />
      </Segment>

      {Object.entries(data).map(([TeacherId, byStatementId]) => (
        <Segment key={TeacherId}>
          <HeaderGrid
            Left={
              <Header>
                {getPersonName(
                  get(teachers.items.byId, [TeacherId, 'User', 'Person'])
                )}{' '}
                [Score: {get(scoreByTeacherId, TeacherId)}%]
              </Header>
            }
          />

          {Object.entries(byStatementId).map(([statementId, data]) => (
            <React.Fragment key={`statementId-${statementId}`}>
              <Header as="h4">
                {get(studentfeedbacks.statementItems.byId, [
                  statementId,
                  'statement'
                ])}
              </Header>
              {get(studentfeedbacks.statementItems.byId, [
                statementId,
                'toRate'
              ]) === true ? (
                <List bulleted celled>
                  {Object.entries(data).map(([feedback, stats]) => (
                    <List.Item key={`${TeacherId}-${stats.count}`}>
                      <strong>{rateString[feedback]}</strong>: {stats.count}{' '}
                      Students ({stats.percentage}%)
                    </List.Item>
                  ))}
                </List>
              ) : (
                <List bulleted>
                  {Object.entries(data).map(([feedback, stats]) => (
                    <List.Item key={`${TeacherId}-${stats.count}`}>
                      {feedback}
                    </List.Item>
                  ))}
                </List>
              )}
            </React.Fragment>
          ))}
        </Segment>
      ))}
    </>
  )
}

const mapStateToProps = (
  { teachers, termcourses, studentfeedbacks },
  { TermId, CourseId }
) => ({
  teachers,
  termcourse: get(termcourses.items.byId, `${TermId}_${CourseId}`),
  termcourses,
  studentfeedbacks
})

const mapDispatchToProps = {
  fetchAllTeachersPage,
  getTermCourseTeachers,
  getStudentFeedbacks,
  getAllFeedbackStatements
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentFeedbacksShow)
