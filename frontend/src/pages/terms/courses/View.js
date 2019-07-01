import { Link } from '@reach/router'
import CourseHeader from 'components/Data/CourseHeader.js'
import StudentFeedbacks from 'components/Data/StudentFeedbacks/Student/Main'
import TermHeader from 'components/Data/TermHeader.js'
import HeaderGrid from 'components/HeaderGrid.js'
import Permit from 'components/Permit.js'
import { get } from 'lodash-es'
import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Segment, Table } from 'semantic-ui-react'
import { fetchAllTeachersPage } from 'store/actions/teachers.js'
import {
  getEnrollments,
  getResearchEnrollments,
  getTermCourse,
  getTermCourseTeachers
} from 'store/actions/terms.js'
import getPersonName from 'utils/get-person-name.js'
import EnrolledRow from './view/EnrolledRow.js'

function TermCourseView({
  TermId,
  CourseId,
  courseType,
  enrollments,
  getEnrollments,
  getResearchEnrollments,
  teachers,
  fetchAllTeachersPage,
  termcourses,
  getTermCourseTeachers,
  termcourse,
  getTermCourse
}) {
  useEffect(() => {
    fetchAllTeachersPage()
  }, [fetchAllTeachersPage])

  useEffect(() => {
    if (!termcourse) getTermCourse(TermId, CourseId)
  }, [CourseId, TermId, getTermCourse, termcourse])

  useEffect(() => {
    if (courseType && courseType !== 'supervised') {
      getTermCourseTeachers(TermId, { query: `filter=CourseId==${CourseId}` })
    }
  }, [CourseId, TermId, courseType, getTermCourseTeachers])

  useEffect(() => {
    getEnrollments(TermId, CourseId)
    if (courseType === 'supervised') getResearchEnrollments(TermId, CourseId)
  }, [TermId, CourseId, courseType, getEnrollments, getResearchEnrollments])

  const enrollmentIds = useMemo(() => {
    const regex = RegExp(`^${TermId}_${CourseId}_`)
    return enrollments.items.allIds.filter(id => regex.test(id))
  }, [TermId, CourseId, enrollments])

  const TeacherIdsBySection = useMemo(() => {
    return get(termcourses.teacherIdsBySection, `${TermId}_${CourseId}`, {})
  }, [CourseId, TermId, termcourses.teacherIdsBySection])

  return (
    <>
      <Segment>
        <HeaderGrid
          Left={<CourseHeader CourseId={CourseId} />}
          Right={<TermHeader TermId={TermId} />}
        />
      </Segment>

      {courseType !== 'supervised' && (
        <Segment>
          <HeaderGrid
            Left={<Header>Teachers</Header>}
            Right={
              <Permit sysadmin>
                <Button as={Link} to={`assign-teachers`}>
                  Assign Teachers
                </Button>
              </Permit>
            }
          />

          <Table celled>
            <Table.Body>
              {Object.entries(TeacherIdsBySection).map(
                ([section, TeacherIds = []]) => (
                  <Table.Row key={section}>
                    <Table.Cell collapsing>
                      <strong>Section {section}</strong>
                    </Table.Cell>
                    <Table.Cell>
                      {TeacherIds.map(TeacherId =>
                        getPersonName(
                          get(teachers.items.byId, [
                            TeacherId,
                            'User',
                            'Person'
                          ])
                        )
                      ).join(', ')}
                    </Table.Cell>
                  </Table.Row>
                )
              )}
            </Table.Body>
          </Table>
        </Segment>
      )}

      <StudentFeedbacks TermId={TermId} CourseId={CourseId} />

      <Segment>
        <HeaderGrid
          Left={<Header>Enrollments</Header>}
          Right={
            <Permit sysadmin>
              {courseType !== 'supervised' && (
                <Button as={Link} to={`assign-sections`}>
                  Assign Sections
                </Button>
              )}
            </Permit>
          }
        />
      </Segment>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            {courseType && (
              <Table.HeaderCell>
                {courseType === 'supervised' ? 'Superviser' : 'Section'}
              </Table.HeaderCell>
            )}
            <Table.HeaderCell collapsing />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {enrollmentIds.sort().map(id => (
            <EnrolledRow
              key={id}
              courseType={courseType}
              section={get(enrollments.items.byId, [id, 'section'])}
              TermId={TermId}
              CourseId={CourseId}
              StudentId={get(enrollments.items.byId, [id, 'StudentId'])}
              TeacherId={get(enrollments.researchItems.byId, [id, 'TeacherId'])}
            />
          ))}
        </Table.Body>
      </Table>
    </>
  )
}

const mapStateToProps = (
  { courses, enrollments, teachers, termcourses },
  { TermId, CourseId }
) => ({
  courseType: get(courses.items.byId, [CourseId, 'type']),
  enrollments,
  teachers,
  termcourses,
  termcourse: get(termcourses.items.byId, `${TermId}_${CourseId}`)
})

const mapDispatchToProps = {
  getTermCourseTeachers,
  getEnrollments,
  getResearchEnrollments,
  fetchAllTeachersPage,
  getTermCourse
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TermCourseView)
