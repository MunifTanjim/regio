const router = require('express').Router()

const list = require('../../handlers/terms/list.js')
router.get('/', list.authorizer, list.handler)

const read = require('../../handlers/terms/read.js')
router.get('/:TermId', read.authorizer, read.handler)

const getAllSections = require('../../handlers/terms/get-sections.js')
router.get(
  '/:TermId/sections',
  getAllSections.authorizer,
  getAllSections.handler
)

const readAllCourses = require('../../handlers/terms/courses/read-all.js')
router.get(
  '/:TermId/courses',
  readAllCourses.authorizer,
  readAllCourses.handler
)

const readAllAttendances = require('../../handlers/terms/courses/attendances/read-all.js')
router.get(
  '/:TermId/courses/:CourseId/attendances',
  readAllAttendances.authorizer,
  readAllAttendances.handler
)

const toggleFeedbackOpen = require('../../handlers/terms/courses/action/toggle-feedback-open.js')
router.post(
  '/:TermId/courses/:CourseId/action/toggle-feedback-open',
  toggleFeedbackOpen.authorizer,
  toggleFeedbackOpen.handler
)

const takeAttendances = require('../../handlers/terms/courses/attendances/take.js')
router.post(
  '/:TermId/courses/:CourseId/attendances',
  takeAttendances.authorizer,
  takeAttendances.handler
)

const updateAttendances = require('../../handlers/terms/courses/attendances/update.js')
router.post(
  '/:TermId/courses/:CourseId/attendances/:date',
  updateAttendances.authorizer,
  updateAttendances.handler
)

const readAllEnrollments = require('../../handlers/terms/courses/enrollments/read-all.js')
router.get(
  '/:TermId/courses/:CourseId/enrollments',
  readAllEnrollments.authorizer,
  readAllEnrollments.handler
)

const assignSections = require('../../handlers/terms/courses/enrollments/sections/set.js')
router.post(
  '/:TermId/courses/:CourseId/enrollments/sections',
  assignSections.authorizer,
  assignSections.handler
)

const readAllClassTestMarks = require('../../handlers/terms/courses/marks/theory/classtest/read-all.js')
router.get(
  '/:TermId/courses/:CourseId/marks/theory/classtest',
  readAllClassTestMarks.authorizer,
  readAllClassTestMarks.handler
)

const readAllTheoryMarks = require('../../handlers/terms/courses/marks/theory/read-all.js')
router.get(
  '/:TermId/courses/:CourseId/marks/theory',
  readAllTheoryMarks.authorizer,
  readAllTheoryMarks.handler
)

const readAllSessionalMarks = require('../../handlers/terms/courses/marks/sessional/read-all.js')
router.get(
  '/:TermId/courses/:CourseId/marks/sessional',
  readAllSessionalMarks.authorizer,
  readAllSessionalMarks.handler
)

const readAllResearchMarks = require('../../handlers/terms/courses/marks/research/read-all.js')
router.get(
  '/:TermId/courses/:CourseId/marks/research',
  readAllResearchMarks.authorizer,
  readAllResearchMarks.handler
)

const readAllResearches = require('../../handlers/terms/courses/researches/read-all.js')
router.get(
  '/:TermId/courses/:CourseId/researches',
  readAllResearches.authorizer,
  readAllResearches.handler
)

const setResearchSuperviser = require('../../handlers/terms/courses/researches/set-superviser.js')
router.post(
  '/:TermId/courses/:CourseId/researches/superviser',
  setResearchSuperviser.authorizer,
  setResearchSuperviser.handler
)

const readAllStudentFeedbacks = require('../../handlers/terms/courses/studentfeedbacks/read-all.js')
router.get(
  '/:TermId/courses/:CourseId/studentfeedbacks',
  readAllStudentFeedbacks.authorizer,
  readAllStudentFeedbacks.handler
)

const submitStudentFeedback = require('../../handlers/terms/courses/studentfeedbacks/action/submit.js')
router.post(
  '/:TermId/courses/:CourseId/studentfeedbacks/action/submit',
  submitStudentFeedback.authorizer,
  submitStudentFeedback.handler
)

const readAllFeedbackStatements = require('../../handlers/terms/courses/feedbackstatements/read-all.js')
router.get(
  '/:TermId/courses/:CourseId/feedbackstatements',
  readAllFeedbackStatements.authorizer,
  readAllFeedbackStatements.handler
)

const readAllTermCourses = require('../../handlers/terms/termcourses/read-all.js')
router.get(
  '/:TermId/termcourses',
  readAllTermCourses.authorizer,
  readAllTermCourses.handler
)

const setTermCourses = require('../../handlers/terms/termcourses/set.js')
router.put(
  '/:TermId/termcourses',
  setTermCourses.authorizer,
  setTermCourses.handler
)

const readAllCourseTeachers = require('../../handlers/terms/termcourses/teachers/read-all.js')
router.get(
  '/:TermId/termcourses/teachers',
  readAllCourseTeachers.authorizer,
  readAllCourseTeachers.handler
)

const setCourseTeachers = require('../../handlers/terms/termcourses/teachers/set.js')
router.post(
  '/:TermId/termcourses/teachers',
  setCourseTeachers.authorizer,
  setCourseTeachers.handler
)

const readTermCourse = require('../../handlers/terms/termcourses/read.js')
router.get(
  '/:TermId/termcourses/:CourseId',
  readTermCourse.authorizer,
  readTermCourse.handler
)

const create = require('../../handlers/terms/create.js')
router.post('/', create.authorizer, create.handler)

const delete_ = require('../../handlers/terms/delete.js')
router.delete('/:TermId', delete_.authorizer, delete_.handler)

module.exports = router
