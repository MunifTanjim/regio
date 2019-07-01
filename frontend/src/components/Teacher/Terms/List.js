import HeaderGrid from 'components/HeaderGrid.js'
import Permit from 'components/Permit.js'
import { compact, get, map, uniq, zipObject } from 'lodash-es'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Dropdown, Header, Segment } from 'semantic-ui-react'
import { getTerms } from 'store/actions/teachers.js'
import ListItem from './ListItem.js'

function TeacherTermsList({
  linkToBase,
  TeacherId,
  termIds,
  terms,
  getTerms,
  sessionYearIds
}) {
  const [sessionYearId, setSessionYearId] = useState()

  useEffect(() => {
    if (sessionYearIds[0]) setSessionYearId(sessionYearIds[0])
  }, [sessionYearIds, sessionYearIds.length])

  useEffect(() => {
    getTerms(TeacherId)
  }, [TeacherId, getTerms])

  return (
    <Permit sysadmin head UserId={`T${TeacherId}`}>
      <Segment>
        <HeaderGrid
          Left={<Header>Terms</Header>}
          Right={
            <Dropdown
              search
              selection
              value={sessionYearId}
              options={sessionYearIds.map(id => ({ text: id, value: id }))}
              onChange={(_, { value }) => setSessionYearId(value)}
            />
          }
        />

        {termIds.map(
          id =>
            get(terms[id], 'SessionYearId') === sessionYearId && (
              <ListItem
                key={id}
                TermId={id}
                TeacherId={TeacherId}
                linkToBase={linkToBase}
              />
            )
        )}
      </Segment>
    </Permit>
  )
}

const mapStateToProps = ({ teachers, terms }, { TeacherId }) => {
  const _termIds = get(teachers.items.termsById, TeacherId, [])

  const _terms = zipObject(
    _termIds,
    map(_termIds, id => get(terms.items.byId, id))
  )

  const _sessionYearIds = uniq(
    compact(map(_termIds, termId => get(_terms[termId], 'SessionYearId')))
  )

  return {
    termIds: _termIds,
    terms: _terms,
    sessionYearIds: _sessionYearIds
  }
}

const mapDispatchToProps = {
  getTerms
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeacherTermsList)
