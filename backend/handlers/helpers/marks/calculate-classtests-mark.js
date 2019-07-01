const calculateClassTestsMark = (marks, creditHr) => {
  const countedClassTestsNumber = Number(creditHr)

  const sortedMarks = marks.map(Number).sort()

  let mark = 0

  for (let index = 0; index < countedClassTestsNumber; index++) {
    mark += sortedMarks[index] || 0
  }

  return mark
}

module.exports = calculateClassTestsMark
