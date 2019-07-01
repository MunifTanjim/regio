import Select from 'components/Form/Select.js'
import { connect as connectFormik } from 'formik'
import { get, zipObject } from 'lodash-es'
import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { FormGroup } from 'semantic-ui-react'
import { fetchAllSessionYearsPage } from 'store/actions/sessionyears.js'
import { getEnrollments } from 'store/actions/students.js'
import { fetchAllTermsPages } from 'store/actions/terms.js'

const validLevels = ['1', '2', '3', '4']
const validTerms = ['1', '2']

const levelOptions = zipObject(validLevels, validLevels)
const termOptions = zipObject(validTerms, validTerms)

function TermSelector({
  sessionyears,
  sessionyearsLoading,
  TermId,
  getEnrollments,
  fetchAllTermsPages,
  fetchAllSessionYearsPage,
  formik: {
    values: { StudentId, Term },
    errors: { StudentId: StudentIdError },
    setFieldError
  }
}) {
  useEffect(() => {
    fetchAllSessionYearsPage()
  }, [fetchAllSessionYearsPage])

  useEffect(() => {
    if (Term.SessionYearId) {
      fetchAllTermsPages({
        query: `filter=SessionYearId==${Term.SessionYearId}`
      })
    }
  }, [Term.SessionYearId, fetchAllTermsPages])

  useEffect(() => {
    if (StudentId && !StudentIdError && TermId) {
      getEnrollments(StudentId, { query: `filter=TermId==${TermId}` }).catch(
        err => {
          if (err.status === 404) {
            setFieldError('StudentId', err.message)
          } else console.log(err)
        }
      )
    }
  }, [StudentId, StudentIdError, TermId, getEnrollments, setFieldError])

  const sessionyearOptions = useMemo(
    () => zipObject(sessionyears, sessionyears),
    [sessionyears]
  )

  return (
    <FormGroup widths="equal">
      <Select
        id="Term.SessionYearId"
        name="Term.SessionYearId"
        label={`Session`}
        loading={sessionyearsLoading}
        options={sessionyearOptions}
        search
      />

      <Select
        id="Term.level"
        name="Term.level"
        label={`Level`}
        options={levelOptions}
        search
      />

      <Select
        id="Term.term"
        name="Term.term"
        label={`Term`}
        options={termOptions}
        search
      />
    </FormGroup>
  )
}

const mapStateToProps = (
  { sessionyears, terms },
  {
    formik: {
      values: {
        Term: { SessionYearId, level, term }
      }
    }
  }
) => {
  const TermId = get(terms.markedIds, `${SessionYearId}-${level}-${term}`)

  return {
    sessionyears: sessionyears.items.allIds,
    sessionyearsLoading: sessionyears.pagination.fetching,
    TermId
  }
}

const mapDispatchToProps = {
  getEnrollments,
  fetchAllTermsPages,
  fetchAllSessionYearsPage
}

export default connectFormik(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TermSelector)
)
