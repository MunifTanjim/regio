import TermHeader from 'components/Data/TermHeader.js'
import HeaderGrid from 'components/HeaderGrid.js'
import Permit from 'components/Permit.js'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Segment } from 'semantic-ui-react'
import { getTerm } from 'store/actions/terms.js'
import CoursesList from './Courses/List.js'

function TeacherTermCourseView({ TeacherId, TermId, term, getTerm }) {
  useEffect(() => {
    if (!term) getTerm(TermId)
  }, [TermId, getTerm, term])

  return (
    <Permit sysadmin head UserId={`T${TeacherId}`}>
      <Segment>
        <HeaderGrid Left={<TermHeader TermId={TermId} />} />
      </Segment>

      <CoursesList
        linkToBase="courses/"
        TeacherId={TeacherId}
        TermId={TermId}
      />
    </Permit>
  )
}

const mapStateToProps = ({ terms }, { TermId }) => {
  const _term = get(terms.items.byId, TermId)

  return {
    term: _term
  }
}

const mapDispatchToProps = {
  getTerm
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeacherTermCourseView)
