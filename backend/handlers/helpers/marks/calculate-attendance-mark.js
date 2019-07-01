const calculateAttendanceMark = (totalClass, attendedClass, creditHr) => {
  const totalMarks = Number(creditHr) * 10

  const percentage =
    attendedClass === totalClass ? 100 : (attendedClass / totalClass) * 100

  let factor

  if (percentage >= 90) {
    factor = 100
  } else if (percentage >= 85) {
    factor = 90
  } else if (percentage >= 80) {
    factor = 80
  } else if (percentage >= 75) {
    factor = 70
  } else if (percentage >= 70) {
    factor = 60
  } else if (percentage >= 65) {
    factor = 50
  } else if (percentage >= 60) {
    factor = 40
  } else {
    factor = 0
  }

  const mark = (totalMarks * factor) / 100

  return mark
}

module.exports = calculateAttendanceMark
