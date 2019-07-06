const router = require('express').Router()

const list = require('../../handlers/teachers/list.js')
router.get('/', list.authorizer, list.handler)

const create = require('../../handlers/teachers/create.js')
router.post('/', create.authorizer, create.handler)

const setHead = require('../../handlers/teachers/action/set-head.js')
router.post('/action/set-head', setHead.authorizer, setHead.handler)

const approve = require('../../handlers/teachers/approve.js')
router.post('/:id/approve', approve.authorizer, approve.handler)

const read = require('../../handlers/teachers/read.js')
router.get('/:id', read.authorizer, read.handler)

const update = require('../../handlers/teachers/update.js')
router.patch('/:TeacherId', update.authorizer, update.handler)

const readAllTerms = require('../../handlers/teachers/terms/read-all.js')
router.get('/:TeacherId/terms', readAllTerms.authorizer, readAllTerms.handler)

const readAllCourseByTerm = require('../../handlers/teachers/terms/courses/read-all.js')
router.get(
  '/:TeacherId/terms/:TermId/courses',
  readAllCourseByTerm.authorizer,
  readAllCourseByTerm.handler
)

const readAllClassTestMarks = require('../../handlers/teachers/terms/courses/marks/theory/classtest/read-all.js')
router.get(
  '/:TeacherId/terms/:TermId/courses/:CourseId/marks/theory/classtest',
  readAllClassTestMarks.authorizer,
  readAllClassTestMarks.handler
)

const setClassTestMarks = require('../../handlers/teachers/terms/courses/marks/theory/classtest/set.js')
router.post(
  '/:TeacherId/terms/:TermId/courses/:CourseId/marks/theory/classtest',
  setClassTestMarks.authorizer,
  setClassTestMarks.handler
)

const readAllTheoryMarks = require('../../handlers/teachers/terms/courses/marks/theory/read-all.js')
router.get(
  '/:TeacherId/terms/:TermId/courses/:CourseId/marks/theory',
  readAllTheoryMarks.authorizer,
  readAllTheoryMarks.handler
)

const setTheoryMarks = require('../../handlers/teachers/terms/courses/marks/theory/set.js')
router.post(
  '/:TeacherId/terms/:TermId/courses/:CourseId/marks/theory',
  setTheoryMarks.authorizer,
  setTheoryMarks.handler
)

const readAllSessionalMarks = require('../../handlers/teachers/terms/courses/marks/sessional/read-all.js')
router.get(
  '/:TeacherId/terms/:TermId/courses/:CourseId/marks/sessional',
  readAllSessionalMarks.authorizer,
  readAllSessionalMarks.handler
)

const setSessionalMarks = require('../../handlers/teachers/terms/courses/marks/sessional/set.js')
router.post(
  '/:TeacherId/terms/:TermId/courses/:CourseId/marks/sessional',
  setSessionalMarks.authorizer,
  setSessionalMarks.handler
)

const readAllResearchMarks = require('../../handlers/teachers/terms/courses/marks/research/read-all.js')
router.get(
  '/:TeacherId/terms/:TermId/courses/:CourseId/marks/research',
  readAllResearchMarks.authorizer,
  readAllResearchMarks.handler
)

const setResearchMarks = require('../../handlers/teachers/terms/courses/marks/research/set.js')
router.post(
  '/:TeacherId/terms/:TermId/courses/:CourseId/marks/research',
  setResearchMarks.authorizer,
  setResearchMarks.handler
)

const readAllTermCourses = require('../../handlers/teachers/termcourses/read-all.js')
router.get(
  '/:TeacherId/termcourses',
  readAllTermCourses.authorizer,
  readAllTermCourses.handler
)

// const delete_ = require('../../handlers/teachers/delete.js')
// router.delete('/:id', delete_.authorizer, delete_.handler)

module.exports = router
