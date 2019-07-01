import React from 'react'

import { Image } from 'semantic-ui-react'

import gravatarUrl from '../utils/gravatar-url.js'

function Gravatar({ email, ...props }) {
  return <Image src={gravatarUrl(email)} {...props} />
}

export default Gravatar
