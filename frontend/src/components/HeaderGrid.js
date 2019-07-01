import React, { memo } from 'react'

import { Grid } from 'semantic-ui-react'

function HeaderGrid({
  Left = null,
  Right = null,
  leftClassName = 'grow wide',
  rightClassName = 'auto wide'
}) {
  return (
    <Grid columns={2} verticalAlign="middle">
      <Grid.Column className={leftClassName}>{Left}</Grid.Column>
      <Grid.Column className={rightClassName}>{Right}</Grid.Column>
    </Grid>
  )
}

export default memo(HeaderGrid)
