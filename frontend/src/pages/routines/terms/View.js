import TermHeader from 'components/Data/TermHeader.js'
import HeaderGrid from 'components/HeaderGrid.js'
import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import { Segment } from 'semantic-ui-react'
import Sections from './sections/Main.js'

function RoutineTermView({ TermId, term }) {
  return (
    <>
      <Segment>
        <HeaderGrid Left={<TermHeader TermId={TermId} />} />
      </Segment>

      <Sections TermId={TermId} />
    </>
  )
}

const mapStateToProps = ({ terms }, { TermId }) => ({
  term: get(terms.items.byId, TermId),
  sections: get(terms.sections, TermId, [])
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoutineTermView)
