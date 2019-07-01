import HeaderGrid from 'components/HeaderGrid'
import { get } from 'lodash-es'
import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Card, Label, List } from 'semantic-ui-react'
import Delete from './ActionModals/Delete.js'
import Edit from './ActionModals/Edit.js'

function ContactInfoItem({ data, country, entityId, entityType }) {
  const [open, setOpen] = useState(false)

  const handleToggle = useCallback(() => {
    setOpen(open => !open)
  }, [])

  return (
    <>
      <Card fluid>
        <Card.Content>
          <HeaderGrid
            Left={
              <Card.Header>
                {data.type.map(type => (
                  <Label key={type} color="black" size="mini" basic>
                    {type}
                  </Label>
                ))}
              </Card.Header>
            }
            Right={
              <>
                {open && (
                  <Edit
                    data={data}
                    entityId={entityId}
                    entityType={entityType}
                  />
                )}
                <Delete
                  data={data}
                  entityId={entityId}
                  entityType={entityType}
                />
                <Button
                  icon={`chevron ${open ? 'up' : 'down'}`}
                  onClick={handleToggle}
                />
              </>
            }
          />
        </Card.Content>
        {open && (
          <Card.Content>
            <List>
              {data.email && (
                <List.Item>
                  <strong>Email</strong>: {data.email}
                </List.Item>
              )}
              {data.mobile && (
                <List.Item>
                  <strong>Mobile</strong>: {data.mobile}
                </List.Item>
              )}
              {data.phone && (
                <List.Item>
                  <strong>Phone</strong>: {data.phone}
                </List.Item>
              )}
              {data.Address && (
                <List.Item>
                  <strong>Address</strong>:
                  <p style={{ paddingLeft: '0.5em' }}>
                    {data.Address.line1}
                    <br />
                    {data.Address.line2}
                    <br />
                    {data.Address.line3 && (
                      <>
                        {data.Address.line3}
                        <br />
                      </>
                    )}
                    {data.Address.city}, {data.Address.postalCode}
                    <br />
                    {data.Address.region ? `${data.Address.region}, ` : ''}
                    {get(country, 'name')}
                  </p>
                </List.Item>
              )}
            </List>
          </Card.Content>
        )}
      </Card>
    </>
  )
}

const mapStateToProps = ({ countries }, { data }) => {
  const CountryId = get(data, 'Address.CountryId')
  const _country = CountryId ? get(countries.items.byId, CountryId) : null
  return {
    country: _country
  }
}

export default connect(mapStateToProps)(ContactInfoItem)
