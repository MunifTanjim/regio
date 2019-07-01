import ContactInfo from 'components/ContactInfo/Main.js'
import HeaderGrid from 'components/HeaderGrid.js'
import StudentTerms from 'components/Student/Terms/Main.js'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Header, Segment, Divider } from 'semantic-ui-react'
import { getStudent } from '../../store/actions/students.js'
import getPersonName from '../../utils/get-person-name.js'
import Edit from './ActionModals/Edit.js'
import ResetPassword from './ActionModals/ResetPassword.js'
import { Match } from '@reach/router'

function StudentView({ data, StudentId, getStudent, uri }) {
  useEffect(() => {
    if (!data) getStudent(StudentId)
  }, [StudentId, data, getStudent])

  return data ? (
    <>
      <Segment>
        <HeaderGrid
          Left={
            <Header>
              {getPersonName(get(data, 'User.Person'))}
              <Header.Subheader>ID: {data.id}</Header.Subheader>
            </Header>
          }
          Right={
            <>
              <ResetPassword UserId={get(data, 'User.id')} />
              <Edit StudentId={StudentId} />
            </>
          }
        />

        <Match path={uri}>
          {props =>
            props.match ? (
              <>
                <Divider />
                <ContactInfo StudentId={StudentId} />
              </>
            ) : null
          }
        </Match>
      </Segment>

      <StudentTerms StudentId={StudentId} />
    </>
  ) : null
}

const mapStateToProps = ({ students }, { StudentId }) => ({
  data: students.items.byId[StudentId]
})

const mapDispatchToProps = {
  getStudent
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentView)
