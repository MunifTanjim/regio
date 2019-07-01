const getEntityIdFromUserId = UserId => Number(UserId.replace(/\D+/g, ''))

module.exports = getEntityIdFromUserId
