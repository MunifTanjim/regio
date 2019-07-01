import React from 'react'

import { Loader, Segment } from 'semantic-ui-react'

function PaginationItems({ ids, loading, Item, ...props }) {
  return (
    <Segment basic style={{ minHeight: '100%', padding: 0 }}>
      {loading ? (
        <Segment basic>
          <Loader active />
        </Segment>
      ) : (
        ids.map(id => <Item key={id} id={id} {...props} />)
      )}
    </Segment>
  )
}

export default PaginationItems
