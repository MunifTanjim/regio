const SecurePassword = require('secure-password')

const securePassword = SecurePassword()

const verify = async (user, password) => {
  const passwordBuffer = Buffer.from(password)

  const result = await securePassword.verify(passwordBuffer, user.password)

  switch (result) {
    case SecurePassword.INVALID_UNRECOGNIZED_HASH:
      throw Error('INVALID_UNRECOGNIZED_HASH')
    case SecurePassword.INVALID:
      return false
    case SecurePassword.VALID:
      return true
    case SecurePassword.VALID_NEEDS_REHASH:
      try {
        const improvedHashBuffer = await securePassword.hash(passwordBuffer)

        await user.update({ password: improvedHashBuffer })
      } catch (err) {
        console.error(err)
      }

      return true
  }
}

const hash = async password => {
  const passwordBuffer = Buffer.from(password)

  return securePassword.hash(passwordBuffer)
}

module.exports.hashPassword = hash
module.exports.verifyPassword = verify
