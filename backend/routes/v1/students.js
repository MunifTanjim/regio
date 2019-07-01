const router = require('express').Router()

const list = require('../../handlers/students/list.js')
router.get('/', list.authorizer, list.handler)

const read = require('../../handlers/students/read.js')
router.get('/:id', read.authorizer, read.handler)

const update = require('../../handlers/students/update.js')
router.patch('/:StudentId', update.authorizer, update.handler)

const readAdviser = require('../../handlers/students/adviser/read.js')
router.get('/:StudentId/adviser', readAdviser.authorizer, readAdviser.handler)

const setAdviser = require('../../handlers/students/adviser/set.js')
router.post('/:StudentId/adviser', setAdviser.authorizer, setAdviser.handler)

const approve = require('../../handlers/students/approve.js')
router.post('/:id/approve', approve.authorizer, approve.handler)

const readAllEnrollments = require('../../handlers/students/enrollments/read-all.js')
router.get(
  '/:StudentId/enrollments',
  readAllEnrollments.authorizer,
  readAllEnrollments.handler
)

const setEnrollments = require('../../handlers/students/enrollments/set.js')
router.put(
  '/:StudentId/enrollments',
  setEnrollments.authorizer,
  setEnrollments.handler
)

const approveTermEnrollments = require('../../handlers/students/terms/enrollments/approve.js')
router.post(
  '/:StudentId/terms/:TermId/do/approve',
  approveTermEnrollments.authorizer,
  approveTermEnrollments.handler
)

const readAllAttendances = require('../../handlers/students/terms/courses/attendances/read-all.js')
router.get(
  '/:StudentId/terms/:TermId/courses/:CourseId/attendances',
  readAllAttendances.authorizer,
  readAllAttendances.handler
)

const readTermCourseEnrollment = require('../../handlers/students/terms/courses/enrollment/read.js')
router.get(
  '/:StudentId/terms/:TermId/courses/:CourseId/enrollment',
  readTermCourseEnrollment.authorizer,
  readTermCourseEnrollment.handler
)

const readResearchMark = require('../../handlers/students/terms/courses/marks/research/read.js')
router.get(
  '/:StudentId/terms/:TermId/courses/:CourseId/marks/research',
  readResearchMark.authorizer,
  readResearchMark.handler
)

const readSessionalMark = require('../../handlers/students/terms/courses/marks/sessional/read.js')
router.get(
  '/:StudentId/terms/:TermId/courses/:CourseId/marks/sessional',
  readSessionalMark.authorizer,
  readSessionalMark.handler
)

const readTheoryMark = require('../../handlers/students/terms/courses/marks/theory/read.js')
router.get(
  '/:StudentId/terms/:TermId/courses/:CourseId/marks/theory',
  readTheoryMark.authorizer,
  readTheoryMark.handler
)

const readClassTestMarks = require('../../handlers/students/terms/courses/marks/theory/classtest/read-all.js')
router.get(
  '/:StudentId/terms/:TermId/courses/:CourseId/marks/theory/classtest',
  readClassTestMarks.authorizer,
  readClassTestMarks.handler
)

const getCalculatedAttendanceMark = require('../../handlers/students/terms/courses/marks/action/calculate-attendance-mark.js')
router.get(
  '/:StudentId/terms/:TermId/courses/:CourseId/marks/action/calculate-attendance-mark',
  getCalculatedAttendanceMark.authorizer,
  getCalculatedAttendanceMark.handler
)

const getCalculatedClassTestsMark = require('../../handlers/students/terms/courses/marks/action/calculate-classtests-mark.js')
router.get(
  '/:StudentId/terms/:TermId/courses/:CourseId/marks/action/calculate-classtests-mark',
  getCalculatedClassTestsMark.authorizer,
  getCalculatedClassTestsMark.handler
)

// const delete_ = require('../../handlers/batches/delete.js')
// router.delete('/:id', delete_.authorizer, delete_.handler)

module.exports = router
