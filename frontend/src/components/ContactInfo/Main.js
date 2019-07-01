import HeaderGrid from 'components/HeaderGrid'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Header, Segment, Button } from 'semantic-ui-react'
import { getAllCountries } from 'store/actions/countries.js'
import Add from './ActionModals/Create.js'
import ContactInfoItem from './Item.js'
import useToggle from 'hooks/useToggle.js'

function ContactInfo({ items, getAllCountries, entityType, entityId }) {
  useEffect(() => {
    getAllCountries({ query: 'fields=CountryId,name' })
  }, [getAllCountries])

  const [open, handler] = useToggle(false)

  return (
    <>
      <HeaderGrid
        Left={<Header>Contact Information</Header>}
        Right={
          <>
            {open && <Add entityId={entityId} entityType={entityType} />}
            <Button
              icon={`chevron ${open ? 'up' : 'down'}`}
              onClick={handler.toggle}
            />
          </>
        }
      />

      {open &&
        items.map((item, i) => (
          <ContactInfoItem
            key={i}
            data={item}
            entityId={entityId}
            entityType={entityType}
          />
        ))}
    </>
  )
}

const mapStateToProps = (
  { user, students, teachers },
  { TeacherId, StudentId }
) => {
  const entityType = TeacherId ? 'teacher' : StudentId ? 'student' : 'current'
  const entity =
    entityType === 'teacher'
      ? get(teachers.items.byId, TeacherId)
      : entityType === 'student'
      ? get(students.items.byId, StudentId)
      : get(user, 'data')
  const entityId = get(entity, 'id')

  return {
    entityType,
    entityId,
    items: get(entity, 'User.Person.ContactInfos', [])
  }
}

const mapDispatchToProps = {
  getAllCountries
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactInfo)
