import React, { useMemo } from 'react'
import ForTeacher from './teacher.js'
import ForStudent from './student.js'
import { get, map } from 'lodash-es'

function ClassTestsReport({ user, ...props }) {
  const roleIds = useMemo(() => map(get(user, 'User.Roles'), 'id'), [user])
  const isStudent = useMemo(() => {
    roleIds.includes('student')
  }, [roleIds])

  return isStudent ? <ForStudent {...props} /> : <ForTeacher {...props} />
}

export default ClassTestsReport
