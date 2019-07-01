const gradeLettter = {
  '4.00': 'A+',
  '3.75': 'A',
  '3.50': 'A-',
  '3.25': 'B+',
  '3.00': 'B',
  '2.75': 'B-',
  '2.50': 'C+',
  '2.25': 'C',
  '2.00': 'D',
  '0.00': 'F'
}

const defaultOptions = { isShort: false, isTheory: false }

const calculateGrade = (
  obtainedMark,
  totalMark,
  {
    isShort = defaultOptions.isShort,
    isTheory = defaultOptions.isTheory
  } = defaultOptions
) => {
  const percentage = (obtainedMark / totalMark) * 100

  const result = {}

  if (percentage >= 80) {
    result.point = 4.0
  } else if (percentage >= 75) {
    result.point = 3.75
  } else if (percentage >= 70) {
    result.point = 3.5
  } else if (percentage >= 65) {
    result.point = 3.25
  } else if (percentage >= 60) {
    result.point = 3.0
  } else if (percentage >= 55) {
    result.point = 2.75
  } else if (percentage >= 50) {
    result.point = 2.5
  } else if (percentage >= 45) {
    result.point = 2.25
  } else if (percentage >= 40) {
    result.point = 2.0
  } else {
    result.point = 0
  }

  if (isShort) result.point = Math.min(3.0, result.point)

  const letter = gradeLettter[result.point.toFixed(2)]

  result.letter = !isTheory && letter === 'D' ? 'F' : letter

  return result
}

export default calculateGrade
