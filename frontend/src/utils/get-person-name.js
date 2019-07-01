const getPersonName = ({
  firstName = '',
  middleName = '',
  lastName = ''
} = {}) => {
  return `${firstName}${middleName ? ` ${middleName} ` : ' '}${lastName}`.trim()
}

export default getPersonName
