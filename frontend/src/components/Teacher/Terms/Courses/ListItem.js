import { Link } from '@reach/router'
import Permit from 'components/Permit.js'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Grid, Header, Label, Segment } from 'semantic-ui-react'
import { getCourse } from 'store/actions/courses.js'

function TeacherTermCourseListItem({
  linkToBase,
  TeacherId,
  TermId,
  CourseId,
  course,
  getCourse
}) {
  useEffect(() => {
    if (!course) getCourse(CourseId)
  }, [CourseId, course, getCourse])

  return (
    <Permit sysadmin head UserId={`T${TeacherId}`}>
      <Segment>
        <Grid columns={2}>
          <Grid.Column className="grow wide">
            <Header>
              {get(course, 'title')}
              <Header.Subheader>
                {get(course, 'code')}{' '}
                <Label attached="top right">
                  {get(course, 'type', '').toUpperCase()}
                </Label>
              </Header.Subheader>
            </Header>
          </Grid.Column>
          <Grid.Column className="auto wide">
            <Button as={Link} to={`${linkToBase}${CourseId}`}>
              Open
            </Button>
          </Grid.Column>
        </Grid>
      </Segment>
    </Permit>
  )
}

const mapStateToProps = ({ courses }, { CourseId }) => ({
  course: get(courses.items.byId, CourseId)
})

const mapDispatchToProps = {
  getCourse
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeacherTermCourseListItem)
