import { Link } from '@reach/router'
import TermHeader from 'components/Data/TermHeader'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit.js'
import React from 'react'
import { Button, Segment } from 'semantic-ui-react'
import CoursesList from './Courses/List.js'

function StudentTermView({ StudentId, TermId }) {
  return (
    <Permit sysadmin head teacher UserId={StudentId}>
      <Segment>
        <HeaderGrid
          Left={<TermHeader TermId={TermId} />}
          Right={
            <Button as={Link} to={`enrollments`}>
              Enrollments
            </Button>
          }
        />
      </Segment>

      <CoursesList
        linkToBase="courses/"
        StudentId={StudentId}
        TermId={TermId}
      />
    </Permit>
  )
}

export default StudentTermView
