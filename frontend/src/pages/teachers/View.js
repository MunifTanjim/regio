import ContactInfo from 'components/ContactInfo/Main.js'
import HeaderGrid from 'components/HeaderGrid'
import TeacherTerms from 'components/Teacher/Terms/Main.js'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Header, Segment, Divider } from 'semantic-ui-react'
import { getTeacher } from 'store/actions/teachers.js'
import getPersonName from 'utils/get-person-name.js'
import Edit from './ActionModals/Edit.js'
import SetHead from './ActionModals/SetHead'
import ResetPassword from './ActionModals/ResetPassword.js'

function View({ data, TeacherId, getTeacher }) {
  useEffect(() => {
    if (!data) getTeacher(TeacherId)
  }, [TeacherId, data, getTeacher])

  return data ? (
    <>
      <Segment>
        <HeaderGrid
          Left={
            <Header>
              {getPersonName(get(data, 'User.Person'))}
              <Header.Subheader>ID: {get(data, 'User.id')}</Header.Subheader>
            </Header>
          }
          Right={
            <>
              <ResetPassword UserId={get(data, 'User.id')} />
              <SetHead data={data} />
              <Edit TeacherId={TeacherId} />
            </>
          }
        />

        <Divider />
        <ContactInfo TeacherId={TeacherId} />
      </Segment>

      <TeacherTerms TeacherId={TeacherId} />
    </>
  ) : null
}

const mapStateToProps = ({ teachers }, { TeacherId }) => ({
  data: get(teachers.items.byId, TeacherId)
})

const mapDispatchToProps = {
  getTeacher
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(View)
