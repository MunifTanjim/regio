const getTermObject = (SessionYearId, level, term) => ({
  SessionYearId,
  level,
  term
})

const getSession20182019Level4Term2Enrollments = () => {
  const termObject = getTermObject('2017-2018', '4', '2')

  const CourseCodes = [
    'ETE 400',
    'ETE 409',
    'ETE 410',
    'ETE 411',
    'ETE 412',
    'ETE 413',
    'ETE 414',
    'ETE 415',
    'ETE 455',
    'ETE 456'
  ]

  const StudentIds = [
    1408001,
    1408002,
    1408003,
    1408004,
    1408006,
    1408007,
    1408008,
    1408009,
    1408010,
    1408012,
    1408013,
    1408014,
    1408015,
    1408016,
    1408017,
    1408018,
    1408019,
    1408020,
    1408021,
    1408022,
    1408023,
    1408024,
    1408025,
    1408026,
    1408027,
    1408028,
    1408029,
    1408030
  ]

  const approved = true

  return {
    termObject,
    CourseCodes,
    StudentIds,
    approved
  }
}

module.exports = [getSession20182019Level4Term2Enrollments()]
