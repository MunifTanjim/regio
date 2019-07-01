import React, { memo } from 'react'

import { Grid, Header, Segment } from 'semantic-ui-react'

import ListItem from './ListItem.js'

import HeaderGrid from 'components/HeaderGrid.js'

function CoursesList({ CourseIds, Item = ListItem, linkBase }) {
  return (
    <Segment>
      <HeaderGrid
        Left={
          <Grid.Column className="grow wide">
            <Header>Courses</Header>
          </Grid.Column>
        }
      />

      {CourseIds.map(id => (
        <Item key={id} CourseId={id} linkBase={linkBase} />
      ))}
    </Segment>
  )
}

export default memo(CoursesList)
