import isBdMobile from '@muniftanjim/is-mobile-phone-number-bd'
import FormCheckboxArray from 'components/Form/CheckboxArray'
import Form from 'components/Form/Form.js'
import FormInput from 'components/Form/Input.js'
import FormSelect from 'components/Form/Select'
import { Formik } from 'formik'
import useModal from 'hooks/useModal.js'
import { get } from 'lodash-es'
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Button, FormGroup, Header, Message, Modal } from 'semantic-ui-react'
import { updateContactInfo } from 'store/actions/users.js'
import * as Yup from 'yup'

const validTypes = ['current', 'permanent', 'home', 'office', 'personal']
const typeOptions = {
  current: 'Current',
  permanent: 'Parmanent',
  home: 'Home',
  office: 'Office',
  personal: 'Personal'
}

function ContactInfoEdit({
  countries,
  UserId,
  data,
  updateContactInfo,
  isCurrent
}) {
  const [open, { handleOpen, handleClose }] = useModal(false)

  const [withAddress, setWithAddress] = useState(!!get(data, 'Address'))

  useEffect(() => {
    setWithAddress(!!get(data, 'Address'))
  }, [data])

  const countryOptions = useMemo(() => {
    return countries.items.allIds.reduce((opts, id) => {
      opts[id] = get(countries.items.byId, [id, 'name'], '')
      return opts
    }, {})
  }, [countries])

  const validationSchema = useMemo(() => {
    const schema = Yup.object({
      type: Yup.array()
        .of(Yup.string().oneOf(validTypes))
        .min(1, 'need at least one'),
      email: Yup.string().email('invalid email'),
      mobile: Yup.string().test(
        'is-bd-mobile',
        'invalid format',
        v => !v || isBdMobile(v)
      ),
      phone: Yup.string().matches(/^(\+?88)?0[\d\-()]+$/, 'invalid format')
    })

    return withAddress
      ? schema.shape({
          address: Yup.object({
            line1: Yup.string().required(`required`),
            line2: Yup.string().required(`required`),
            line3: Yup.string().notRequired(),
            city: Yup.string().required(`required`),
            region: Yup.string().notRequired(),
            postalCode: Yup.string().required(`required`),
            CountryId: Yup.number()
              .integer()
              .required(`required`)
          })
        })
      : schema
  }, [withAddress])

  const initialValues = useMemo(() => {
    const values = {
      ContactInfoId: get(data, 'id'),
      PersonId: get(data, 'PersonId'),
      type: get(data, 'type'),
      email: get(data, 'email') || '',
      mobile: get(data, 'mobile') || '',
      phone: get(data, 'phone') || '',
      address: withAddress
        ? {
            line1: get(data, 'Address.line1') || '',
            line2: get(data, 'Address.line2') || '',
            line3: get(data, 'Address.line3') || '',
            city: get(data, 'Address.city') || '',
            region: get(data, 'Address.region') || '',
            postalCode: get(data, 'Address.postalCode') || '',
            CountryId: String(get(data, 'Address.CountryId') || '')
          }
        : null
    }

    return values
  }, [data, withAddress])

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={async (values, actions) => {
        actions.setStatus(null)

        try {
          await updateContactInfo(
            UserId,
            values.ContactInfoId,
            values,
            isCurrent
          )
          actions.resetForm()
          handleClose()
        } catch (err) {
          if (err.errors) {
            err.errors.forEach(({ param, message }) =>
              actions.setFieldError(param, message)
            )
          } else if (err.message) {
            actions.setStatus(err.message)
          } else {
            actions.setStatus(null)
            console.error(err)
          }
        }

        actions.setSubmitting(false)
      }}
    >
      {({ isSubmitting, isValid, values, status }) => (
        <Modal
          trigger={<Button onClick={handleOpen}>Edit</Button>}
          closeIcon
          open={open}
          onClose={handleClose}
          as={Form}
          size="large"
        >
          <Header>Edit Contact Information</Header>

          <Modal.Content>
            {status ? <Message color="yellow">{status}</Message> : null}

            <FormCheckboxArray
              id="type"
              name="type"
              label={`Type`}
              options={typeOptions}
              style={{ paddingRight: '0.75em' }}
            />

            <FormInput type="email" id="email" name="email" label={`Email`} />
            <FormInput id="mobile" name="mobile" label={`Mobile No.`} />
            <FormInput id="phone" name="phone" label={`Phone No.`} />

            {withAddress && values.address ? (
              <>
                <label style={{ display: 'block', marginBottom: '0.2em' }}>
                  <strong>Address Lines</strong>
                </label>
                <FormInput
                  id="address.line1"
                  name="address.line1"
                  label={`Line 1`}
                  hideLabel
                />
                <FormInput
                  id="address.line2"
                  name="address.line2"
                  label={`Line 2`}
                  hideLabel
                />
                <FormInput
                  id="address.line3"
                  name="address.line3"
                  label={`Line 3`}
                  hideLabel
                />

                <FormGroup widths="equal">
                  <FormInput
                    id="address.city"
                    name="address.city"
                    label={`City`}
                  />
                  <FormInput
                    id="address.postalCode"
                    name="address.postalCode"
                    label={`Postal Code`}
                  />
                </FormGroup>
                <FormGroup widths="equal">
                  <FormInput
                    id="address.region"
                    name="address.region"
                    label={`Region`}
                  />
                  <FormSelect
                    id="address.CountryId"
                    name="address.CountryId"
                    label={`Country`}
                    options={countryOptions}
                    search
                  />
                </FormGroup>
              </>
            ) : (
              <Button type="button" onClick={() => setWithAddress(true)}>
                Add Address
              </Button>
            )}
          </Modal.Content>
          <Modal.Actions>
            <Button type="reset">Reset</Button>
            <Button
              positive
              type="submit"
              loading={isSubmitting}
              disabled={!isValid || isSubmitting}
            >
              Save
            </Button>
          </Modal.Actions>
        </Modal>
      )}
    </Formik>
  )
}

const mapStateToProps = (
  { countries, user, students, teachers },
  { entityType, entityId }
) => {
  const entity =
    entityType === 'teacher'
      ? get(teachers.items.byId, entityId)
      : entityType === 'student'
      ? get(students.items.byId, entityId)
      : get(user, 'data')

  return {
    countries,
    isCurrent: entityType === 'current',
    UserId: get(entity, 'User.id')
  }
}

const mapDispatchToProps = {
  updateContactInfo
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactInfoEdit)
