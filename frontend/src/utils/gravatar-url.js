import md5 from 'md5-o-matic'
import { stringify } from 'query-string'

const baseUrl = 'https://www.gravatar.com/avatar'

const gravatarUrl = (email = 'user@example.com', options = {}) => {
  options = Object.assign({ d: 'retro' }, options)

  if (!~email.indexOf('@')) {
    throw new Error('invalid email')
  }

  return `${baseUrl}/${md5(email.toLowerCase().trim())}?${stringify(options)}`
}

export default gravatarUrl
