import HeaderGrid from 'components/HeaderGrid.js'
import React from 'react'
import { Header, Segment } from 'semantic-ui-react'
import Overview from './Overview/Main.js'

function StudentCourseMarksView({ TermId, CourseId, StudentId, linkToBase }) {
  return (
    <>
      <Segment>
        <HeaderGrid Left={<Header>Marks Overview</Header>} />
      </Segment>

      <Overview
        TermId={TermId}
        CourseId={CourseId}
        StudentId={StudentId}
        linkToBase={linkToBase}
      />
    </>
  )
}

export default StudentCourseMarksView
