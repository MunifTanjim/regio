import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import { Table } from 'semantic-ui-react'
import getPersonName from 'utils/get-person-name'
import SetSuperviser from '../ActionModals/SetSuperviser.js'

function TermCourseEnrolledRow({
  TermId,
  CourseId,
  StudentId,
  TeacherId,
  superviser,
  courseType,
  section
}) {
  return (
    <Table.Row>
      <Table.Cell>{StudentId}</Table.Cell>
      {courseType && (
        <Table.Cell>
          {courseType === 'supervised'
            ? TeacherId
              ? getPersonName(get(superviser, 'User.Person'))
              : 'N/A'
            : section}
        </Table.Cell>
      )}
      <Table.Cell collapsing>
        {courseType === 'supervised' && (
          <SetSuperviser
            TermId={TermId}
            CourseId={CourseId}
            StudentId={StudentId}
            TeacherId={TeacherId}
          />
        )}
      </Table.Cell>
    </Table.Row>
  )
}

const mapStateToProps = ({ teachers }, { TeacherId }) => ({
  superviser: TeacherId ? get(teachers.items.byId, TeacherId) : null
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TermCourseEnrolledRow)
