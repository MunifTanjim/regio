import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Segment } from 'semantic-ui-react'
import { getAllSections } from 'store/actions/terms.js'

function RoutineTermSectionsList({
  TermId,
  term,
  sections,
  getAllSections,
  linkToBase
}) {
  useEffect(() => {
    getAllSections(TermId)
  }, [TermId, getAllSections])

  return (
    <>
      <Segment>
        <HeaderGrid Left={<Header>Sections</Header>} />
      </Segment>

      {sections.map(section => (
        <Segment key={section}>
          <HeaderGrid
            Left={<Header>Section {section}</Header>}
            Right={
              <Button as={Link} to={`${linkToBase}${section}`} color="blue">
                Open
              </Button>
            }
          />
        </Segment>
      ))}
    </>
  )
}

const mapStateToProps = ({ terms }, { TermId }) => ({
  sections: get(terms.sections, TermId, [])
})

const mapDispatchToProps = {
  getAllSections
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoutineTermSectionsList)
