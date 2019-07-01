import { Link } from '@reach/router'
import TermHeader from 'components/Data/TermHeader.js'
import HeaderGrid from 'components/HeaderGrid.js'
import Permit from 'components/Permit.js'
import { filter, map, uniq, values } from 'lodash-es'
import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Grid, Header, Segment } from 'semantic-ui-react'
import { getEnrollments } from 'store/actions/students.js'

function StudentTermsList({
  linkToBase,
  StudentId,
  enrollments,
  getEnrollments
}) {
  useEffect(() => {
    getEnrollments(StudentId)
  }, [StudentId, getEnrollments])

  const termIds = useMemo(() => {
    return uniq(
      map(
        filter(values(enrollments.items.byId), {
          StudentId: Number(StudentId)
        }),
        'TermId'
      )
    )
  }, [StudentId, enrollments])

  return (
    <Permit sysadmin head teacher UserId={StudentId}>
      <Segment>
        <Grid verticalAlign="middle" columns={2}>
          <Grid.Column className="grow wide">
            <Header>Terms</Header>
          </Grid.Column>
          <Grid.Column className="auto wide">
            <Permit sysadmin UserId={StudentId}>
              <Button as={Link} to={`terms/enroll`}>
                Enroll
              </Button>
            </Permit>
          </Grid.Column>
        </Grid>

        {termIds.map(TermId => (
          <Segment key={TermId}>
            <HeaderGrid
              Left={<TermHeader TermId={TermId} />}
              Right={
                <Button as={Link} to={`${linkToBase}${TermId}`}>
                  Open
                </Button>
              }
            />
          </Segment>
        ))}
      </Segment>
    </Permit>
  )
}

const mapStateToProps = ({ enrollments }) => ({
  enrollments
})

const mapDispatchToProps = {
  getEnrollments
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentTermsList)
