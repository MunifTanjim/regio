import { get } from 'lodash-es'
import React, { memo, useEffect } from 'react'
import { connect } from 'react-redux'
import { Header } from 'semantic-ui-react'
import { getTerm } from 'store/actions/terms.js'

function TermHeader({ TermId, term, getTerm, ...props }) {
  useEffect(() => {
    if (!term) getTerm(TermId)
  }, [TermId, getTerm, term])

  return (
    <Header {...props}>
      Level {get(term, 'level')} Term {get(term, 'term')}
      <Header.Subheader>Session {get(term, 'SessionYearId')}</Header.Subheader>
    </Header>
  )
}

const mapStateToProps = ({ terms }, { TermId }) => ({
  term: get(terms.items.byId, TermId)
})

const mapDispatchToProps = {
  getTerm
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(TermHeader))
