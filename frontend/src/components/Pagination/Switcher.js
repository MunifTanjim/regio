import React from 'react'

import { Pagination } from 'semantic-ui-react'

const PageSwitcher = ({ activePage, totalPages, onPageChange }) => {
  return totalPages ? (
    <Pagination
      disabled={totalPages < 2}
      activePage={activePage}
      boundaryRange={1}
      siblingRange={1}
      totalPages={totalPages}
      onPageChange={onPageChange}
      firstItem={null}
      lastItem={null}
      prevItem={{
        disabled: activePage === 1,
        content: '⟨',
        'aria-label': `Previous Page`
      }}
      nextItem={{
        disabled: activePage === totalPages,
        content: '⟩',
        'aria-label': `Next Page`
      }}
      aria-label={`Page Navigation`}
    />
  ) : null
}

export default PageSwitcher
