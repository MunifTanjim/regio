import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Segment } from 'semantic-ui-react'
import { getBatch } from 'store/actions/batches.js'
import { toggleFeedbackOpen } from 'store/actions/terms.js'

function StudentFeedbacksOverview({
  TermId,
  CourseId,
  termcourse,
  toggleFeedbackOpen,
  term,
  batch,
  getBatch
}) {
  useEffect(() => {
    if (get(term, 'BatchId') && !batch) getBatch(get(term, 'BatchId'))
  }, [batch, getBatch, term])

  return (
    <>
      <Segment>
        <HeaderGrid
          Left={
            <Header>
              Student Feedbacks (
              {get(termcourse, 'feedbackOpen') ? 'Open' : 'Closed'})
            </Header>
          }
          Right={
            <>
              <Permit student>
                {get(termcourse, 'feedbackOpen') && (
                  <Button as={Link} to={`give-student-feedback`}>
                    Give
                  </Button>
                )}
              </Permit>
              <Button as={Link} to={`student-feedbacks`}>
                Show
              </Button>
              <Permit UserId={`T${get(batch, 'coordinatorId')}`}>
                <Button
                  type="button"
                  onClick={() => toggleFeedbackOpen(TermId, CourseId)}
                >
                  Set {get(termcourse, 'feedbackOpen') ? 'Closed' : 'Open'}
                </Button>
              </Permit>
            </>
          }
        />
      </Segment>
    </>
  )
}

const mapStateToProps = (
  { batches, teachers, terms, termcourses, studentfeedbacks },
  { TermId, CourseId }
) => ({
  teachers,
  termcourse: get(termcourses.items.byId, `${TermId}_${CourseId}`),
  termcourses,
  studentfeedbacks,
  term: get(terms.items.byId, TermId),
  batch: get(batches.items.byId, get(terms.items.byId, [TermId, 'BatchId']))
})

const mapDispatchToProps = {
  getBatch,
  toggleFeedbackOpen
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentFeedbacksOverview)
