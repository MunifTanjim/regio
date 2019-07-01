import { Router } from '@reach/router'
import React, { useMemo } from 'react'
import { Helmet } from 'react-helmet'
import ClassTestsReport from './terms/courses/marks/theory/classtests'
import Routine from './routines/terms/section/index.js'
import TermResults from './terms/results/index.js'
import { parse } from 'query-string'

function PrintPage({ user, location }) {
  const papersize = useMemo(() => {
    const queryData = parse(location.search)
    const landscape = Boolean(queryData.landscape)
    const size = queryData.size || 'A4'
    return `${size}${landscape ? ' landscape' : ''}`
  }, [location.search])

  return (
    <>
      <Helmet
        htmlAttributes={{ id: 'print' }}
        bodyAttributes={{ class: papersize }}
      >
        <style>{`@page { size: ${papersize} }`}</style>
      </Helmet>

      <Router>
        <ClassTestsReport
          path="/terms/:TermId/courses/:CourseId/section/:section/marks/classtests"
          user={user}
        />
        <Routine path="/routines/terms/:TermId/section/:section" user={user} />
        <TermResults path="/terms/:TermId/results" user={user} />
      </Router>
    </>
  )
}

export default PrintPage
