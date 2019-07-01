import HeaderGrid from 'components/HeaderGrid.js'
import React from 'react'
import { Header, Segment } from 'semantic-ui-react'
import Overview from './Overview/Main.js'

function TeacherCourseMarksView({ TeacherId, TermId, CourseId, linkToBase }) {
  return (
    <>
      <Segment>
        <HeaderGrid Left={<Header>Marks Overview</Header>} />
      </Segment>

      <Overview
        TeacherId={TeacherId}
        TermId={TermId}
        CourseId={CourseId}
        linkToBase={linkToBase}
      />
    </>
  )
}

export default TeacherCourseMarksView
