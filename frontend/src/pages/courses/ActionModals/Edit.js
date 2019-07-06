import Form from 'components/Form/Form.js'
import Input from 'components/Form/Input.js'
import Select from 'components/Form/Select.js'
import Permit from 'components/Permit.js'
import { Formik } from 'formik'
import useToggle from 'hooks/useToggle'
import { get, zipObject } from 'lodash-es'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, FormGroup, Header, Message, Modal } from 'semantic-ui-react'
import { updateCourse } from 'store/actions/courses.js'
import * as Yup from 'yup'

const validTypes = ['theory', 'sessional', 'supervised']

const typeOptions = zipObject(validTypes, validTypes.map(v => v.toUpperCase()))

const getValidationSchema = () =>
  Yup.object().shape({
    title: Yup.string().required(`required`),
    type: Yup.string().oneOf(validTypes)
  })

const getInitialValues = data => ({
  title: get(data, 'title', ''),
  type: get(data, 'type', validTypes[0])
})

function Create({ CourseId, data, updateCourse }) {
  const [open, handler] = useToggle(false)

  const initialValues = useMemo(() => getInitialValues(data), [data])
  const validationSchema = useMemo(() => getValidationSchema(), [])
  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await updateCourse(CourseId, values)
        handler.close()
      } catch (err) {
        actions.setSubmitting(false)

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
    },
    [CourseId, handler, updateCourse]
  )

  return (
    <Permit sysadmin>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid, status }) => (
          <Modal
            trigger={<Button onClick={handler.open}>Edit</Button>}
            closeIcon
            open={open}
            onClose={handler.close}
            as={Form}
            size="large"
          >
            <Header>Edit Course {get(data, 'code')}:</Header>

            <Modal.Content>
              <Message color="yellow" hidden={!status}>
                {status}
              </Message>

              <FormGroup widths="equal">
                <Input id="title" name="title" label={`Title`} />

                <Select
                  id="type"
                  name="type"
                  label={`Type`}
                  options={typeOptions}
                />
              </FormGroup>
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
    </Permit>
  )
}

const mapStateToProps = ({ courses }, { CourseId }) => ({
  data: get(courses.items.byId, CourseId)
})

const mapDispatchToProps = {
  updateCourse
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Create)
