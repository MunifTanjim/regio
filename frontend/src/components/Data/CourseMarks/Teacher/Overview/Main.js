import { Link } from '@reach/router'
import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import ClassTests from './ClassTests.js'
import Research from './Research.js'
import Sessional from './Sessional.js'
import Theory from './Theory.js'
import Permit from 'components/Permit.js'

function TeacherCourseMarksOverview({
  TeacherId,
  TermId,
  CourseId,
  courseType,
  linkToBase
}) {
  switch (courseType) {
    case 'theory':
      return (
        <>
          <ClassTests
            TeacherId={TeacherId}
            TermId={TermId}
            CourseId={CourseId}
            title={`Class Test Marks Overview`}
            HeaderRight={
              <>
                <Permit UserId={`T${TeacherId}`}>
                  <Button as={Link} to={`${linkToBase}classtests/edit`}>
                    Edit
                  </Button>
                </Permit>
                <Button color="blue" as={Link} to={`${linkToBase}classtests`}>
                  View
                </Button>
              </>
            }
          />
          <Theory
            TeacherId={TeacherId}
            TermId={TermId}
            CourseId={CourseId}
            title={`Final Marks Overview`}
            HeaderRight={
              <>
                <Permit UserId={`T${TeacherId}`}>
                  <Button as={Link} to={`${linkToBase}theory/edit`}>
                    Edit
                  </Button>
                </Permit>
                <Button color="blue" as={Link} to={`${linkToBase}theory`}>
                  View
                </Button>
              </>
            }
          />
        </>
      )
    case 'sessional':
      return (
        <Sessional
          TeacherId={TeacherId}
          TermId={TermId}
          CourseId={CourseId}
          title={`Final Marks Overview`}
          HeaderRight={
            <>
              <Permit UserId={`T${TeacherId}`}>
                <Button as={Link} to={`${linkToBase}sessional/edit`}>
                  Edit
                </Button>
              </Permit>
              <Button color="blue" as={Link} to={`${linkToBase}sessional`}>
                View
              </Button>
            </>
          }
        />
      )
    case 'supervised':
      return (
        <Research
          TeacherId={TeacherId}
          TermId={TermId}
          CourseId={CourseId}
          title={`Research Marks Overview`}
          HeaderRight={
            <>
              <Permit UserId={`T${TeacherId}`}>
                <Button as={Link} to={`${linkToBase}research/edit`}>
                  Edit
                </Button>
              </Permit>
              <Button color="blue" as={Link} to={`${linkToBase}research`}>
                View
              </Button>
            </>
          }
        />
      )
    default:
      return null
  }
}

const mapStateToProps = ({ courses }, { CourseId }) => ({
  courseType: get(courses.items.byId, [CourseId, 'type'])
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeacherCourseMarksOverview)
