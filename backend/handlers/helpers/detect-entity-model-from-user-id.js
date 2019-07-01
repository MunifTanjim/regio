const UserIdPatterns = {
  Student: /^\d+$/,
  Teacher: /^T\d+$/,
  Staff: /^S\d+$/
}

const detectEntityModelFromUserId = UserId => {
  for (const [modelName, pattern] of Object.entries(UserIdPatterns)) {
    if (pattern.test(UserId)) return modelName
  }

  throw new Error('Invalid UserId')
}

module.exports = detectEntityModelFromUserId
