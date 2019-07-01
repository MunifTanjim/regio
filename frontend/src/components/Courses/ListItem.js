import { Link } from '@reach/router'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Grid, Header, Label, Segment } from 'semantic-ui-react'
import { getCourse } from 'store/actions/courses.js'

function CoursesListItem({ CourseId, course, getCourse, linkBase }) {
  useEffect(() => {
    if (!course) getCourse(CourseId)
  }, [CourseId, course, getCourse])

  return (
    <Segment>
      <Grid columns={2}>
        <Grid.Column className="grow wide">
          <Header>
            {get(course, 'title', '')}
            <Header.Subheader>
              <Label attached="top right">
                {get(course, 'type', '').toUpperCase()}
              </Label>

              {get(course, 'code', '')}
            </Header.Subheader>
          </Header>
        </Grid.Column>
        <Grid.Column className="auto wide">
          <Button as={Link} to={`${linkBase}${CourseId}`}>
            Open
          </Button>
        </Grid.Column>
      </Grid>
    </Segment>
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
)(CoursesListItem)
