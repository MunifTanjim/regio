const term = (SessionYearId, level, term) => ({
  SessionYearId,
  level,
  term
})

module.exports = [
  {
    term: term('2017-2018', '4', '2'),
    data: [
      {
        CourseCode: 'ETE 400',
        TeacherIdsBySection: {}
      },
      {
        CourseCode: 'ETE 409',
        TeacherIdsBySection: { A: [1] }
      },
      {
        CourseCode: 'ETE 410',
        TeacherIdsBySection: { A: [1] }
      },
      {
        CourseCode: 'ETE 411',
        TeacherIdsBySection: { A: [8] }
      },
      {
        CourseCode: 'ETE 412',
        TeacherIdsBySection: { A: [8] }
      },
      {
        CourseCode: 'ETE 413',
        TeacherIdsBySection: { A: [3] }
      },
      {
        CourseCode: 'ETE 414',
        TeacherIdsBySection: { A: [3] }
      },
      {
        CourseCode: 'ETE 415',
        TeacherIdsBySection: { A: [4] }
      },
      {
        CourseCode: 'ETE 455',
        TeacherIdsBySection: { A: [6] }
      },
      {
        CourseCode: 'ETE 456',
        TeacherIdsBySection: { A: [6] }
      }
    ],
    startDate: `2018-12-18`,
    endDate: `2019-04-17`
  }
]
